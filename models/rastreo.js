const db = require('../config/config');

const Package = {};

Package.trackByTrackingId = (trackingId, clientId, result) => {
    const sql = `
    SELECT
        p.Cod_Envio_Paquetes AS id,
        p.id_Casillero,
        COALESCE(t.descripcion, 'Sin descripción') AS codTipoEnvioDescripcion,
        COALESCE(p.Peso_paquete, 0) AS Peso_paquete,
        COALESCE(p.Volumen_paquete, 0) AS Volumen_paquete,
        p.Numero_Traking,
        tp.Descripcion_Pago AS name,
        p.compra,
        p.id_Tipo_Seguro,
        p.Id_Estado_Envio,
        p.Direccion_Envio,
        p.Fecha_Entrega,
        p.Fecha_pedido
    FROM
        tbl_paquete p
    JOIN
        tbl_casillero c ON p.id_Casillero = c.Id_Casillero
    JOIN
        tbl_tipo_envio t ON p.Cod_Tipo_Envio = t.Cod_Tipo_Envio
    JOIN
        tbl_tipo_pago tp ON p.id_tipo_pago = tp.id_tipo_pago
    WHERE
        p.Numero_Traking = ? AND
        c.id_cliente = ?;
`;

    
    db.query(sql, [trackingId, clientId], (err, data) => {
        if (err) {
            console.error('Error en la consulta para obtener paquete por ID de seguimiento:', err);
            result(err, null);
        } else {
            if (data.length === 0) {
                console.log('No se encontró ningún paquete con el número de seguimiento:', trackingId);
                result(null, null);
            } else {
                console.log('Paquete encontrado por número de seguimiento:', data[0]);
                result(null, data[0]);
            }
        }
    });
};


module.exports = Package;
