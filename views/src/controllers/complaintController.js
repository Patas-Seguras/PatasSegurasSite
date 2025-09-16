const complaint = require('../models/complaint.js')
const upload = require('../config/multer.js');

// A rota de denúncias
const submitComplaint = async (req, res)  => {
    try {
        const { whichComplaint, name, localization, description, anonymous } = req.body;
        const photos = req.file;
        await complaint.create({
            whichComplaint,
            name,
            photos: req.file?.buffer || null,
            photoType: req.file?.mimetype || null,
            localization,
            description,
            anonymous: anonymous === 'on' || anonymous === 'true'
        });

        res.status(201).render('home');
    } catch (error) {
        console.error('Erro no envio das denúncias: ', error.message);
        res.status(500).send('Erro interno no servidor, por favor retorne a tela anterior.');
    }
};

module.exports = submitComplaint;
