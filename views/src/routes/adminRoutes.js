const express = require('express');
const router = express.Router();

const Complaint = require('../models/complaint');

const {
    getDashboard,
    getComplaintDetail,
    updateComplaintStatus,
    sendMessage,
    createTestComplaint
} = require('../controllers/adminController');

function requireAuth(req, res, next) {
    if (!req.session.users) {
        return res.redirect('/login-page');
    }

    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.users?.isAdmin) {
        return res.status(403).send('Acesso negado');
    }

    next();
}

router.get('/admin/dashboard-data', async (req, res) => {
  try {

    const totalCount = await Complaint.count();

    const pendingCount = await Complaint.count({
      where: { status: 'pending' }
    });

    const resolvedCount = await Complaint.count({
      where: { status: 'resolved' }
    });

    const urgentCount = await Complaint.count({
      where: { status: 'urgent' }
    });

    const complaints = await Complaint.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      totalCount,
      pendingCount,
      resolvedCount,
      urgentCount,
      complaints
    });

  } catch (error) {

    console.error('Erro API dashboard:', error);

    res.status(500).json({
      error: 'Erro ao carregar dashboard'
    });

  }
});

router.use('/admin', requireAuth, requireAdmin);

router.get('/admin/api/complaint/:id', async (req, res) => {

  try {

    const complaint = await Complaint.findByPk(req.params.id)

    if (!complaint) {
      return res.json({ success: false })
    }

    res.json({
      success: true,
      complaint
    })

  } catch (error) {

    console.error("Erro API complaint:", error)

    res.json({
      success: false
    })

  }

})

router.get('/admin', getDashboard);
router.get('/admin/denuncias/:id', getComplaintDetail);
router.post('/admin/denuncias/:id/status', updateComplaintStatus);
router.post('/admin/denuncias/:id/mensagens', sendMessage);
router.post('/admin/nova-denuncia-teste', createTestComplaint);

module.exports = router;
