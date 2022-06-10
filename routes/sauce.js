const express = require('express');
const router = express.Router();
const auth =require('../middleware/auth');//--Middleware d'authentification
const multer = require('../middleware/multer-config');//--Middleware de gestion des fichiers

const saucesCtrl = require('../controllers/sauces');

//*****Routes des sauces
//--Ajouter une nouvelle Sauce
router.post('/', auth, multer, saucesCtrl.createSauce);//--multer doit être après auth pour éviter l'enregistrement d'un fichier sans authentification
  
//--Mettre à jour une Sauce existante
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//--Suppression d'une Sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//--Récupération d'une Sauce spécifique
router.get('/:id', auth, saucesCtrl.getOneSauce);

//--Route GET qui renvoie toutes les Sauces dans la base de données
router.get('/', auth, saucesCtrl.getAllSauces);

module.exports = router;

//*****Route des likes et dislikes
router.post('/:id/like', auth, saucesCtrl.likeSauce)

//--Nota : La méthode use a pour principe d'être écoutée pour tout type de requête tant qu'aucune autre fonction est appellée