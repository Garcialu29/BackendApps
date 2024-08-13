const Package = require('../models/rastreo');

module.exports = {
    
    trackByTrackingId(req, res) {
        const trackingId = req.params.trackingId;
        const clientId = req.params.clientId; // Obtener el Id_Cliente desde la consulta

        // Verifica si el ID de seguimiento se proporciona
        if (!trackingId) {
            return res.status(404).json({ success: false, message: 'ID de seguimiento no proporcionado' });
        }
    
        Package.trackByTrackingId(trackingId, clientId, (err, package) => {
            if (err) {
                console.error('Error al buscar el paquete:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Hubo un error al buscar el paquete por ID de seguimiento',
                    error: err
                });
            }
            if (!package) {
                return res.status(404).json({ success: false, message: 'Paquete no encontrado' });
            }
            return res.json({ success: true, message: 'Paquete encontrado', data: package });
        });
    }
};
