// models/Contact.js
const mongoose = require('mongoose');

// Schéma pour les messages de contact
const contactSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    trim: true,
    lowercase: true
  },
  sujet: {
    type: String,
    required: [true, 'Le sujet est requis'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Créer le modèle
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;