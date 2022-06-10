const express = require('express');
const app = express();//--Permet de créer une apllication express
const mongoose = require('mongoose');
const path = require('path');//--Importation de node appelée path qui nous donne accès au chemin de notre sustème de fichier

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user')

//--Connection à la base de données
mongoose.connect('mongodb+srv://david-arboin:THEmongodb86@cluster0.kgjcz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//--En-tête de sécurité CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//--Intercepte toutes les requêtes qui ont un content-type json et met à disposition ce corps de requête sur l'objet requête dans req.body
app.use(express.json());

//--Permet de servir le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);

//Racine de tout ce qui est lié à l'authentification
app.use('/api/auth', userRoutes)

module.exports = app;//--Exporte l'application pour y accéder depuis les autres fichiers