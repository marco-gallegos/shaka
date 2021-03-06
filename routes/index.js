/* Controllers */
const PersonaController = require('../controller').PersonaController;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send ({
        message: 'Example project did not give you access to the api web services',
    }));
    
    app.post('/api/persona', PersonaController.create);
    app.post('/api/persona/body', PersonaController.create2);
    
    app.get('/api/persona/:nombre/:codigo', PersonaController.list);
    app.delete('/api/persona', PersonaController.delete);
};