const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')

const userModel = require('../models/user')


exports.signup = (req, res, next) =>{
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        var user = new userModel({
            email : req.body.email,
            password : hash
        })
        user.save()
        .then(() => res.status(201).json({message : "Utilisateur crée"}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}

exports.login = (req, res, next) =>{
    userModel.findOne({email: req.body.email})
    .then(user =>{
        if (!user){
            res.stauts(401).json({message : 'Utilsateur non trouvé !'})
        } else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid =>{
                if (!valid){
                    res.status(401).json({message : 'Mot de passe incorrect'})
                } else{
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId : user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        )
                    })
                }
            })
            .catch(error =>{
                res.status(500).json({error})
            })
        }
    })
    .catch(error => {
        res.status(500).json({error})
    })
}