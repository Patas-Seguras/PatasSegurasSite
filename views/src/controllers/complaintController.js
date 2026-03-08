const Complaint = require('../models/complaint.js');

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

    await Complaint.create({
      animal: animal || 'Não informado',
      complaintType: complaintType || 'Não informado',
      name: name || 'Não informado',
      number: number || 'Não informado',
      email: email || null,
      city: city || null,
      address: address || null,   // corrigido (tinha um "A" aqui)
      photos: firstPhoto ? firstPhoto.buffer : null,
      photoType: firstPhoto ? firstPhoto.mimetype : null,
      location: location,
      description: description || 'Sem descrição.',
      status: 'pending'
    });

    res.status(201).render('home');
  } catch (error) {
    console.error('Erro no envio das denúncias:', error);
    res.status(500).send('Erro interno no servidor, por favor retorne a tela anterior.');
  }
};

module.exports = submitComplaint;