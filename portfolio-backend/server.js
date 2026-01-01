// server.js - Backend complet pour portfolio
require('dotenv').config();

// Modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

// Initialisation
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// 1. MIDDLEWARE
// ============================================

// Autoriser les requêtes depuis le frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parser les données JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 2. ROUTES
// ============================================

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: '🎯 API Portfolio - Ali Echlouchi',
    status: '✅ En ligne',
    version: '1.0.0',
    endpoints: {
      contact: '/api/contact',
      health: '/api/health'
    }
  });
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serveur fonctionnel',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? '✅ Connecté' : '❌ Déconnecté'
  });
});

// Routes des contacts
app.use('/api/contact', contactRoutes);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// ============================================
// 3. CONNEXION BASE DE DONNÉES
// ============================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connecté avec succès !');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    console.log('💡 Astuce: Assurez-vous que MongoDB est en cours d\'exécution');
  }
};

// ============================================
// 4. DÉMARRAGE SERVEUR
// ============================================

const startServer = async () => {
  // Connecter à la base de données
  await connectDB();
  
  // Démarrer le serveur
  app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║        🚀 SERVEUR DÉMARRÉ            ║
    ╠══════════════════════════════════════╣
    ║ Port:        ${PORT}                  ║
    ║ URL:         http://localhost:${PORT} ║
    ║ MongoDB:     ${mongoose.connection.readyState === 1 ? '✅ Connecté' : '⚠️  En attente'} ║
    ╚══════════════════════════════════════╝
    
    📍 Endpoints:
    • GET  /              - Accueil API
    • GET  /api/health    - Santé serveur
    • GET  /api/contact   - Liste messages
    • POST /api/contact   - Envoyer message
    • GET  /api/contact/test - Test routes
    
    🌐 Frontend: ${process.env.FRONTEND_URL}
    `);
  });
};

// Démarrer l'application
startServer();