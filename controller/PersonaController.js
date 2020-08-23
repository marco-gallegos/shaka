const Sequelize     = require('sequelize');
const { response } = require('express');
const persona_imagen_aws_s3       =  require('../models').persona_imagen_aws_s3;

module.exports = { 
    list(_, res) {
        return persona_imagen_aws_s3.findAll({})
        .then(persona_imagen_aws_s3 => res.status(200).send(persona_imagen_aws_s3))
        .catch(error => res.status(400).send(error))
    },

    create(request, res) {

        console.log(request.files);

        /*
        persona_imagen_aws_s3.create ({
        })
        */

        return res.status(code=200).send(
            {
                status : false,
                data: null,
                message: "jajakxjskjfbakcb"
            }
        )
    },
};