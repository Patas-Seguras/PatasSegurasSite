const complaint = require('../models/complaint.js');

const submitComplaint = async (req, res) => {
    try {
        const {
            animal,
            complaintType,
            name,
            number,
            email,
            city,
            address,
            latitude,
            longitude,
            description
        } = req.body;

        const firstPhoto = Array.isArray(req.files) ? req.files[0] : null;
        const location = latitude && longitude ? `${latitude}, ${longitude}` : null;

        await complaint.create({
            animal: animal || 'Não informado',
            complaintType: complaintType || 'Não informado',
            name: name || 'Não informado',
            number: number || 'Não informado',
            email: email || null,
            city: city || null,
            address: address || null,
            photos: firstPhoto?.buffer || null,
            photoType: firstPhoto?.mimetype || null,
            location,
            description: description || 'Sem descrição.',
            status: 'Ativa'
        });

        res.status(201).render('home');
    } catch (error) {
        console.error('Erro no envio das denúncias: ', error.message);
        res.status(500).send('Erro interno no servidor, por favor retorne a tela anterior.');
    }
};

module.exports = submitComplaint;
