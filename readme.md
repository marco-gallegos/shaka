# Shaka
## API Para Gestion de Imagenes en AWS S3

## install

Para levantar este repo se necesita

1. docker y docker-compose
2. Instancia local de mysql corriendo
3. tener archivo env con datos de acceso a bucket de aws s3
4. usuario password y db para guardar los datos
5. configurar user, password y db en config/config.json -> development
6. Instalar sequelize orm para correr migraciones $(npm install -g sequelize-cli)
7. Correr migraciones $(sequelize db:migrate)
8. Validar que se ejecutaron las migraciones
9. docker-compose up
10. visitar localhost:7000

Auxiliares

* respaldo de insomnia requests en la carpeta dev_utils


```shell
npm install -g sequelize-cli
npm install
sequelize db:migrate

npm start
```