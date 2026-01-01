// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// 🔵 TEST : Vérifier que les routes fonctionnent
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API Contact fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

// 📤 POST : Envoyer un nouveau message
router.post('/', async (req, res) => {
  try {
    console.log('📩 Nouveau message reçu:', req.body);
    
    const { nom, email, sujet, message } = req.body;
    
    // Validation simple
    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }
    
    // Créer le contact
    const nouveauContact = new Contact({
      nom,
      email,
      sujet,
      message
    });
    
    // Sauvegarder
    const contactSauvegarde = await nouveauContact.save();
    
    console.log('✅ Message sauvegardé:', contactSauvegarde.email);
    
    // Réponse de succès
    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès !',
      data: {
        id: contactSauvegarde._id,
        nom: contactSauvegarde.nom,
        email: contactSauvegarde.email,
        date: contactSauvegarde.date
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur. Veuillez réessayer.'
    });
  }
});

// 📥 GET : Récupérer tous les messages (pour admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;