const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
//--Récupération du token dans le header de la requête
      const token = req.headers.authorization.split(' ')[1];//--Split permet de générer un tableau avec deux éléments dont le 1er est le mot bearer (ce mot se place automatiquement devant le token) et le deuxième le token
//--Décoder le token
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//--'RANDOM_TOKEN_SECRET' est la clé secrète qui serait plus longue et aléatoire en production
//--Une fois le token décodé, il devient un objet javaScript classqiue
//--On récupère l'userId qui est dedans
      const userId = decodedToken.userId;
//--Ajout d'un objet  auth  à l'objet de requête qui contient le  userId  extrait du token
      req.auth = { userId };
//--On vérifie que l'userId de la requête correspond à celui du token
      if (req.body.userId && req.body.userId !== userId) {
//--S'ils sont différents
        throw 'ID utilisateur non valable !';
//--S/ils sont identiques
      } else {
        next();
      }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée'})
    }
};