const complaint = require('../models/complaint.js')
const upload = require('../config/multer.js');

// A rota de denúncias
const submitComplaint = async (req, res)  => {
    try {
        const { animal, complaintType ,number, latitude, longitude, description } = req.body;
        const photos = req.file;
        const location = `${latitude}, ${longitude}`;
        await complaint.create({
            animal: animal === '' ? 'Erro, o caso não foi registrado.': animal,
            complaintType: complaintType === '' ? 'Erro, o tipo da denuncia não foi enviado.': complaintType,
            number: number === ''? 'Erro, número não encontrado.': number , 
            photos: req.file?.buffer || null,
            photoType: req.file?.mimetype || null,
            location,
            description: description === '' ? 'Sem descrição.': description,

        });

        res.status(201).render('home');
    } catch (error) {
        console.error('Erro no envio das denúncias: ', error.message);
        res.status(500).send('Erro interno no servidor, por favor retorne a tela anterior.');
    }
};

module.exports = submitComplaint;
