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
    list(request, response) {
        let rules = {
            nombre: 'required',
            codigo: 'required',
        };
        let dataResponse= {
            status : true,
            data: null,
            error: false,
            message: "Desconocido",
        };
        
        // validacion de el request
        let validation = new Validator(request.params, rules);
        
        if (!validation.fails()){
            return persona_imagen_aws_s3.findAll({
                where:{
                    nombre: request.params.nombre,
                    codigo: request.params.codigo
                }
            })
            .then(persona_imagen_aws_s3 => {
                dataResponse.data = persona_imagen_aws_s3;
                dataResponse.message = "se encontraron registros de la persona";
                return response.status(200).send(dataResponse);
            })
            .catch(error => {
                dataResponse.error = error;
                dataResponse.message = "error al obtener usuario";
                return response.status(404).send(dataResponse);
            });
        }

    },


    /**
     * Almacenar los datos de 
     * @param {*} request 
     * @param {*} response 
     */
    async create(request, response) {
        console.log("create normal")
        console.log(request.body);
        console.log(request.files);
        //console.log(Object.keys(request.files).length);
        
        let rules = {
            nombre: 'required',
            codigo: 'required',
        };
        let dataResponse= {
            status : true,
            data: null,
            error: false,
            message: "Desconocido",
        };
        
        // validacion de el request
        let validation = new Validator(request.body, rules);
        let numero_imagenes = Object.keys(request.files).length;
        
        if (numero_imagenes < 15){
            dataResponse.status = false;
            dataResponse.error = true;
            dataResponse.message = "no hay suficientes imnagenes";
        }
        if(validation.fails()){
            dataResponse.status = false;
            dataResponse.error = true;
            dataResponse.message = validation.errors.errors;
        }else{
            // validar la existencia en db de el registro
            let existe = await persona_imagen_aws_s3.findOne({
                where: {
                    codigo: request.body.codigo
                }
            });
            
            //console.table({existeendb: existe});
            if(existe){
                dataResponse.status = false;
                dataResponse.error = true;
                dataResponse.message = "ya esta registrado en la db";
            }
        }
        
        //FIXME: cachar errores y borrar info
        if (!dataResponse.error){

            
            for (const index in request.files) {
                let imgkey = `${request.body.nombre}/${request.body.codigo}_${index}.jpeg`;
                /*
                console.log({
                    "file": request.files[index],
                    "imgkey": imgkey
                })
                */
                // configuracion para subir a s3
                let parametrosPutObject = {
                    Bucket: process.env.s3_bucket,
                    Key: imgkey, // nombre que tendra -> se usa para descargar
                    // el body debe ser secuancia binaria
                    Body: request.files[index].data
                }
                //console.log(aws_s3.config);
                //console.log(process.env.s3_bucket);
                //console.log(parametrosPutObject);
    
                // subimos la imagen
                // FIXME: lo ideal es que esto se comporte como sincrono y hasta que se resuelvan las peticiones continue
                await aws_s3.putObject(parametrosPutObject,(err,data)=>{
                    /*
                    console.log(data);
                    console.table({'error':err});
                    console.log(data.ETag);
                    console.log(data.VersionId);
                    */
                    if(!err){
                        persona_imagen_aws_s3.create ({
                            codigo: request.body.codigo,
                            nombre: request.body.nombre,
                            key: imgkey,
                            etag: "bug inecesario",
                            versionid: "nada"//data.VersionId
                        });
                    }else{
                        console.log(err)
                    }
                });
            }

            dataResponse.message = "se almacenaron las imagenes de forma exitosa`";
        }

        return response.status(code=200).send(dataResponse)
    },

    /**
     * Almacenar los datos de 
     * @param {*} request 
     * @param {*} response 
     */
    async create2(request, response) {
        console.log(request.files);
        //console.log(request.body);
        //console.log(Object.keys(request.files).length);
        
        let rules = {
            nombre: 'required',
            codigo: 'required',
        };
        let dataResponse= {
            status : true,
            data: null,
            error: false,
            message: "Desconocido",
        };
        
        // validacion de el request
        let validation = new Validator(request.body, rules);
        let numero_imagenes = Object.keys(request.files).length;
        
        if (numero_imagenes < 15){
            dataResponse.status = false;
            dataResponse.error = true;
            dataResponse.message = "no hay suficientes imnagenes";
        }
        if(validation.fails()){
            dataResponse.status = false;
            dataResponse.error = true;
            dataResponse.message = validation.errors.errors;
        }else{
            // validar la existencia en db de el registro
            let existe = await persona_imagen_aws_s3.findOne({
                where: {
                    codigo: request.body.codigo
                }
            });
            
            //console.table({existeendb: existe});
            if(existe){
                dataResponse.status = false;
                dataResponse.error = true;
                dataResponse.message = "ya esta registrado en la db";
            }
        }
        
        if (!dataResponse.error){

            for (const index in request.files) {
                let imgkey = `${request.body.nombre}/${request.body.codigo}_${index}.jpeg`;
                console.log({
                    "file": request.files[index],
                    "imgkey": imgkey
                }) 
                continue;
                // configuracion para subir a s3
                let parametrosPutObject = {
                    Bucket: process.env.s3_bucket,
                    Key: imgkey, // nombre que tendra -> se usa para descargar
                    // el body debe ser secuancia binaria
                    Body: request.files[1].data
                }
                //console.log(aws_s3.config);
                //console.log(process.env.s3_bucket);
                //console.log(parametrosPutObject);
    
                // submos la imagen
                // FIXME: lo ideal es que esto se comporte como sincrono y hasta que se resuelvan las peticiones continue
                await aws_s3.putObject(parametrosPutObject,(err,data)=>{
                    /*
                    console.table({'error':err});
                    console.log(data);
                    console.log(data.ETag);
                    console.log(data.VersionId);
                    */
                    persona_imagen_aws_s3.create ({
                        codigo: request.body.codigo,
                        nombre: request.body.nombre,
                        key: imgkey,
                        etag: data.ETag,
                        versionid: data.VersionId
                    });
                });
            }
            dataResponse.message = "se almacenaron las imagenes de forma exitosa`";
        }

        return response.status(code=200).send(dataResponse)
    },


    async delete(request, res){
        let rules = {
            nombre: 'required',
            codigo: 'required',
        };
        let dataResponse= {
            status : true,
            statusCode: 422,
            data: null,
            error: false,
            message: "Desconocido",
        };
        
        // validacion de el request
        let validation = new Validator(request.body, rules);
        
        if(validation.fails()){
            dataResponse.status = false;
            dataResponse.error = true;
            dataResponse.message = validation.errors.errors;
        }else{
            // validar la existencia en db de el registro
            let existe = await persona_imagen_aws_s3.findAll({
                where: {
                    codigo: request.body.codigo,
                    nombre: request.body.nombre
                }
            });
            
            console.log(existe)
            console.table({existeendb: existe.length});
            if(existe.length >= 0){

                const del = await Promise.all(
                    existe.map(async (persona)=>{
                        persona.destroy();
                    })
                )

                dataResponse.status = true;
                dataResponse.statusCode = 200;
                dataResponse.error = false;
                dataResponse.message = "Se eliminaros los registros";
            }else{
                dataResponse.status = false;
                dataResponse.statusCode = 404;
                dataResponse.error = true;
                dataResponse.message = "no se encontraron registros";
            }
        }
        return res.status(dataResponse.statusCode).json(dataResponse);
    }
};