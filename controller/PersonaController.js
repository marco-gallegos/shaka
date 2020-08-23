const Sequelize             = require('sequelize');
const { response }          = require('express');
const persona_imagen_aws_s3 =  require('../models').persona_imagen_aws_s3;
const Validator             = require('validatorjs');
const AWS                   = require('aws-sdk');

let aws_s3_config = {
    accessKeyId: process.env.s3_acces_key,
    secretAccessKey: process.env.s3_secret
};

const aws_s3 = new AWS.S3(aws_s3_config);

Validator.useLang('es');

module.exports = { 
    list(_, res) {
        return persona_imagen_aws_s3.findAll({})
        .then(persona_imagen_aws_s3 => res.status(200).send(persona_imagen_aws_s3))
        .catch(error => res.status(400).send(error))
    },

    create(request, response) {

        //console.log(request.files);
        //console.log(request.body);
        //console.log(Object.keys(request.files).length);
        
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
            // TODO: la imagen debe tener un formato de nombre muy mamalon y se debe guardar en la tabla

            // configuracion para subir a s3
            let parametrosPutObject = {
                Bucket: process.env.s3_bucket,
                Key: 'imagen.jpg', // nombre que tendra
                // el body debe ser secuancia binaria
                Body: request.files[1].data
            }
            //console.log(aws_s3.config);
            //console.log(process.env.s3_bucket);
            //console.log(parametrosPutObject);

            aws_s3.putObject(parametrosPutObject,(err,data)=>{
                console.log(err);
                console.log(data);

                console.log(data.ETag);
                console.log(data.VersionId);

            });

            /*
            person a_imagen_aws_s3.create ({
                codigo: request.body.codigo,
                nombre: request.body.nombre,
                etag: "",
            })
            */
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