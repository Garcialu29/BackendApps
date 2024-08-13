const rastreoController = require('../controllers/rastreoController');

module.exports = (app) => {
    // Define la ruta con dos segmentos variables: :trackingId y :clientId
    app.get('/api/rastrear_paquete/trackByTrackingId/:trackingId/:clientId', rastreoController.trackByTrackingId);
};
