const express = require('express');
const router = express.Router();
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

router.use('/admin', requireAuth, requireAdmin);

router.get('/admin', getDashboard);
router.get('/admin/denuncias/:id', getComplaintDetail);
router.post('/admin/denuncias/:id/status', updateComplaintStatus);
router.post('/admin/denuncias/:id/mensagens', sendMessage);
router.post('/admin/nova-denuncia-teste', createTestComplaint);

module.exports = router;
