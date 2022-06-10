const mongoose = require('mongoose');

//--Assure l'ubicité du mail grâce au module mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true },//-- adresse e-mail de l'utilisateur [unique]
    password: {type: String, require: true }//-- mot de passe de l'utilisateur haché
});

//--Applique le unisqueVAlidator au schéma avnt dans faure un modèle
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)