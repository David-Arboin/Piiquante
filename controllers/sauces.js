//--Logique métier des routes
const Sauce = require('../schemas/Sauce');
const fs = require('fs'); //--Donne accès aux fonctions sui permettent de modifier le système de fichier y compris les fonctions qui permettent de supprimer
const path = require('path');

//--Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//--Reconstruction de l'Url de l'image
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};

//--Modification d'une sauce
exports.modifySauce = (req, res, next) => {
//--Test > Nouvelle image ou non
    const sauceObject = req.file ? //--req.file ? est un opérateur ternaire pour savoir si un fichier existe
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//--Reconstruction de l'Url de l'image
    } : { ...req.body }
//--Récupération d'une sauce dans la base et vérification qu'il appartient bien à la personne qui effectue la requête delete
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            if (!sauce) {
                return res.status(404).json({
                    error: new Error('Sauce non trouvée !')
                })
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({
                    error: new Error('Requête non autorisée !')
                })
            }
//--Suppression de lancienn image dans le système de fichier
            const fileName = sauce.imageUrl.split('/images/')[1]//--Nom de l'ancienne sauce
            const fileLocation = __dirname + '/backend/images/'
            console.log(fileName)
            console.log(fileLocation)
            console.log(fileLocation + fileName)
/*             fs.unlinkSync(fileLocation + fileName) */

            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })//--Cette ligne permet de comparer les id afin d'être certain de mettre à jour le bon sauce
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({ error }));
        }
    )
};

//--Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })//--On trouve l'objet dans la base de données 
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];//--Ici, split renvoit un tableau composé de deux éléments. 1- Ce qu'il y avant /images/ et un deuxième élément avec ce qu'il y après /images/
            fs.unlink(`images/${filename}`, () => {//--unlink est une fonction de fs (file système qui permet de supprimer un fichier``)
                Sauce.deleteOne({ _id: req.params.id })//--Ici, pas besoin de 2eme argument car c'est une suppression
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                    .catch(error => res.status(400).json({ error })); 
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//--Récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//--Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//*****Likes et Dislikes
exports.likeSauce = (req, res, next) => {

//--Si l'utilisateur ajoute un like
 if (req.body.like === 1) {
    Sauce.findOne({ _id: req.params.id }).then(
      (sauce) => {
//--On regarde s'il est déjà dans le tableau "usersLiked"
//--S'il n'y est pas, on incrémente "Like" et on l'ajoute au tableau "usersLiked"
        if (!sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } }
          )
            .then(() => res.status(200).json({ message: "Like Ok !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
  }

//--Si l'utilisateur ajoute un dislike
  if (req.body.like === -1) {
    Sauce.findOne({ _id: req.params.id }).then(
      (sauce) => {
//--On regarde s'il est déjà dans le tableau "usersDisliked"
//--S'il n'y est pas, on incrémente "Dislike" et on l'ajoute au tableau "usersDisliked"
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } }
          )
            .then(() => res.status(200).json({ message: "Dislike Ok!" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
  }

//--Si l'utilisateur supprime son "like" ou son "dislike"
  if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id }).then(
      (sauce) => {
//--S'il est dans le tableau "usersLiked", on décrémente "Like" et on le supprime du tableau "usersLiked"
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
          )
            .then(() => res.status(200).json({ message: "Delete like Ok !" }))
            .catch((error) => res.status(400).json({ error }));
        }

//--S'il est dans le tableau "usersDisliked", on décrémente "Dislike" et on le supprime du tableau "usersLiked"
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
          )
            .then(() => res.status(200).json({ message: "Delete dislike Ok !" }))
            .catch((error) => res.status(400).json({ error }));
        }

      })
  }
}