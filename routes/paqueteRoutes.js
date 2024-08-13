
const packagesController = require('../controllers/packagesController');

module.exports = (app) => {
    app.get('/api/tbl_paquete/getAllByLocker/:idCliente',packagesController.getAllByLocker);

  // Resto de tus rutas
  app.post('/api/tbl_paquete/create', packagesController.create);
};

