const Package = require('../models/package');

module.exports = {
    create(req, res) {
        const package = req.body;

        Package.create(package, (err, clientId) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la creación del paquete',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'El paquete se creó correctamente',
                data: `${clientId}`
            });
        });
    },

    getAllByLocker(req, res) {
        const idCliente = req.params.idCliente;
        // Verifica si req.user está definido y tiene la propiedad idCliente
        if (!idCliente) {
            return res.status(404).json({success: false, message: 'ID del cliente no proporcionado' });
        }
    
        console.log('Obteniendo número de casillero para el cliente con ID:', idCliente);
    
        Package.getAllByLocker(idCliente, (err, data) => {
            if (err) {
                console.error('Error al obtener paquetes:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Hubo un error al listar los paquetes del cliente',
                    error: err
                });
            }
            console.log('Paquetes obtenidos correctamente:', data);
            return res.json(data);
        });
    }
    
};
