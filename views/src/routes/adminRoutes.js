const express = require('express');
const router = express.Router();

function requireAdmin(req, res, next) {
    if (!req.session.users || !req.session.users.isAdmin) {
        return res.status(403).send('Acesso negado' );
    }
    next();
}

// Exemplo de rota protegida
router.get('/admin', requireAdmin, (req, res) => {
    res.render('admin', { title: 'Painel Admin' });
});



module.exports = router;