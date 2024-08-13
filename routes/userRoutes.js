const usersController = require('../controllers/usersController');

module.exports = (app) => {
    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/tbl_cliente/getUserById/:clientId', usersController.getUserById);
    app.post('/api/tbl_cliente/create', usersController.register);
    app.post('/api/tbl_cliente/login', usersController.login);
    app.post('/api/tbl_cliente/requestPasswordReset', usersController.requestPasswordReset);
    app.post('/api/tbl_cliente/changePassword', usersController.changePassword);
    app.put('/api/tbl_cliente/updateUserInfo/:clientId', usersController.updateUserInfo);
}
