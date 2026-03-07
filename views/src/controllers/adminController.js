const { Op, fn, col, literal } = require('sequelize');
const Complaint = require('../models/complaint');
const Message = require('../models/message');
const ComplaintAction = require('../models/complaintAction');

const STATUS_LABELS = {
    ativa: 'Pendente',
    desativada: 'Em análise',
    concluida: 'Resolvido',
    urgente: 'Urgente'
};

const statusBadgeClass = {
    ativa: 'warning',
    desativada: 'primary',
    urgente: 'danger',
    concluida: 'success'
};

const DB_STATUS_MAP = {
    ativa: 'Ativa',
    desativada: 'Desativada',
    urgente: 'Urgente',
    concluida: 'Concluída'
};

const normalizeStatus = (status) => {
    if (!status) return 'ativa';

    const normalized = String(status)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

    if (['pendente', 'ativa'].includes(normalized)) return 'ativa';
    if (['em_analise', 'desativada', 'em analise'].includes(normalized)) return 'desativada';
    if (['resolvido', 'concluida', 'concluída'].includes(normalized)) return 'concluida';
    if (normalized === 'urgente') return 'urgente';

    return 'ativa';
};


const ensureSupportTables = async () => {
    await Message.sync();
    await ComplaintAction.sync();
};

const getDashboard = async (req, res) => {
    try {
        await ensureSupportTables();

        const { city, status, date, animal } = req.query;
        const where = {};

        if (city) where.city = city;
        if (status) where.status = DB_STATUS_MAP[normalizeStatus(status)] || 'Ativa';
        if (animal) where.animal = { [Op.iLike]: `%${animal}%` };
        if (date) {
            where[Op.and] = [literal(`DATE("complaint"."createdAt") = DATE('${date}')`)];
        }

        const [
            totalCount,
            resolvedCount,
            pendingCount,
            urgentCount,
            recentComplaints,
            monthlyRaw,
            cityRaw,
            cities,
            animals
        ] = await Promise.all([
            Complaint.count(),
            Complaint.count({ where: { status: 'Concluída' } }),
            Complaint.count({ where: { status: 'Ativa' } }),
            Complaint.count({ where: { status: 'Urgente' } }),
            Complaint.findAll({
                where,
                order: [['createdAt', 'DESC']],
                limit: 10
            }),
            Complaint.findAll({
                attributes: [
                    [fn('to_char', fn('date_trunc', 'month', col('createdAt')), 'MM/YYYY'), 'month'],
                    [fn('COUNT', col('id')), 'count']
                ],
                group: [fn('date_trunc', 'month', col('createdAt'))],
                order: [[fn('date_trunc', 'month', col('createdAt')), 'ASC']],
                limit: 6,
                raw: true
            }),
            Complaint.findAll({
                attributes: ['city', [fn('COUNT', col('id')), 'count']],
                group: ['city'],
                order: [[literal('count'), 'DESC']],
                raw: true
            }),
            Complaint.findAll({ attributes: ['city'], group: ['city'], raw: true }),
            Complaint.findAll({ attributes: ['animal'], group: ['animal'], raw: true })
        ]);

        const monthlyData = monthlyRaw.map((item) => ({
            label: item.month,
            value: Number(item.count)
        }));

        const cityData = cityRaw
            .filter((item) => item.city)
            .map((item) => ({
                city: item.city,
                value: Number(item.count)
            }));

        const complaints = recentComplaints.map((entry) => ({
            ...entry.get({ plain: true }),
            normalizedStatus: normalizeStatus(entry.status),
            statusLabel: STATUS_LABELS[normalizeStatus(entry.status)] || 'Pendente',
            badgeClass: statusBadgeClass[normalizeStatus(entry.status)] || 'secondary'
        }));

        res.render('admin', {
            title: 'Painel Administrativo',
            stats: {
                totalCount,
                resolvedCount,
                pendingCount,
                urgentCount
            },
            monthlyData,
            cityData,
            complaints,
            quickCounts: {
                pending: pendingCount,
                resolved: resolvedCount,
                urgent: urgentCount
            },
            filters: { city, status, date, animal },
            cityOptions: cities.map((item) => item.city).filter(Boolean),
            animalOptions: animals.map((item) => item.animal).filter(Boolean),
            statusLabels: STATUS_LABELS
        });
    } catch (error) {
        console.error('Erro ao carregar dashboard administrativo:', error.message);
        res.status(500).send('Erro ao carregar o painel administrativo.');
    }
};

const getComplaintDetail = async (req, res) => {
    try {
        await ensureSupportTables();

        const complaint = await Complaint.findByPk(req.params.id, {
            include: [
                { model: Message, as: 'messages', required: false },
                { model: ComplaintAction, as: 'actions', required: false }
            ]
        });

        if (!complaint) {
            return res.status(404).send('Denúncia não encontrada.');
        }

        const detail = complaint.get({ plain: true });
        const normalizedStatus = normalizeStatus(detail.status);

        return res.render('admin-detail', {
            title: `Denúncia #${detail.id}`,
            complaint: {
                ...detail,
                normalizedStatus,
                statusLabel: STATUS_LABELS[normalizedStatus],
                badgeClass: statusBadgeClass[normalizedStatus]
            },
            statusLabels: STATUS_LABELS
        });
    } catch (error) {
        console.error('Erro ao carregar detalhe da denúncia:', error.message);
        res.status(500).send('Erro ao carregar detalhe da denúncia.');
    }
};

const updateComplaintStatus = async (req, res) => {
    try {
        await ensureSupportTables();

        const { status, relatorio } = req.body;
        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) {
            return res.status(404).send('Denúncia não encontrada.');
        }

        const normalizedStatus = normalizeStatus(status);
        await complaint.update({ status: DB_STATUS_MAP[normalizedStatus] || 'Ativa' });

        if (relatorio && relatorio.trim()) {
            await ComplaintAction.create({
                denunciaId: complaint.id,
                status: normalizedStatus,
                relatorio: relatorio.trim(),
                adminEmail: req.session.users?.email || 'admin@local'
            });
        }

        return res.redirect(`/admin/denuncias/${complaint.id}`);
    } catch (error) {
        console.error('Erro ao atualizar status da denúncia:', error.message);
        res.status(500).send('Erro ao atualizar status da denúncia.');
    }
};

const sendMessage = async (req, res) => {
    try {
        await ensureSupportTables();

        const { texto } = req.body;
        if (!texto || !texto.trim()) {
            return res.redirect(`/admin/denuncias/${req.params.id}`);
        }

        const complaint = await Complaint.findByPk(req.params.id);
        if (!complaint) {
            return res.status(404).send('Denúncia não encontrada.');
        }

        await Message.create({
            denunciaId: complaint.id,
            remetente: 'admin',
            texto: texto.trim()
        });

        return res.redirect(`/admin/denuncias/${complaint.id}`);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message);
        res.status(500).send('Erro ao enviar mensagem ao denunciante.');
    }
};

const createTestComplaint = async (req, res) => {
    try {
        await Complaint.create({
            animal: 'Cachorro',
            complaintType: 'Maus-tratos',
            name: 'Denunciante Teste',
            number: '(84) 99999-0000',
            email: 'denunciante@teste.com',
            city: 'Natal',
            address: 'Rua Exemplo, 123',
            description: 'Animal preso sem água em quintal descoberto.',
            status: 'Ativa'
        });

        return res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao criar denúncia de teste:', error.message);
        res.status(500).send('Erro ao criar denúncia de teste.');
    }
};

module.exports = {
    getDashboard,
    getComplaintDetail,
    updateComplaintStatus,
    sendMessage,
    createTestComplaint
};
