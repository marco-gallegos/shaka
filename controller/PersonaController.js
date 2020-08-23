const Sequelize             = require('sequelize');
const { response }          = require('express');
const persona_imagen_aws_s3 =  require('../models').persona_imagen_aws_s3;
const Validator               = require('validatorjs');
Validator.useLang('es');

module.exports = { 
    list(_, res) {
        return persona_imagen_aws_s3.findAll({})
        .then(persona_imagen_aws_s3 => res.status(200).send(persona_imagen_aws_s3))
        .catch(error => res.status(400).send(error))
    },

    create(request, response) {

        console.log(request.files);
        console.log(request.body);
        console.log(Object.keys(request.files).length);
        
        let rules = {
            nombre: 'required',
            codigo: 'required',
        };
        let dataResponse= {
            status : false,
            data: null,
            error: false,
            message: "Desconocido",
        };
        
        let validation = new Validator(request.body, rules);
        let numero_imagenes = Object.keys(request.files).length;
        
        if (numero_imagenes < 15){
            dataResponse.error = true;
            dataResponse.message = "no hay suficientes imnagenes";
        }
        if(validation.fails()){
            
            dataResponse.error = true;
            dataResponse.message = validation.errors.errors;
        }
        
        if (!dataResponse.error){

            persona_imagen_aws_s3.create ({
                codigo: request.body.codigo,
                nombre: request.body.nombre,
                etag: "",
            })
        }

        /*
        var formData = {
            Data: {data: {client: "abc" ...},
            file: fs.createReadStream('testImage_2.jpg'),
        };
        */

        return response.status(code=200).send(dataResponse)
    },
};