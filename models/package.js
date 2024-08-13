const db = require('../config/config');

const Package = {};

Package.getAllByLocker = (idCliente, result) => {
    const sql = `
    SELECT
    p.Cod_Envio_Paquetes AS id,
    p.id_Casillero,
    p.Cod_Tipo_Envio,
    p.Peso_paquete,
    p.Volumen_paquete,
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
    tbl_tipo_pago tp ON p.id_tipo_pago = tp.id_tipo_pago
WHERE
    c.Id_Cliente = ?;

`;


    db.query(sql, [idCliente], (err, data) => {
        if (err) {
            console.error('Error en la consulta para obtener paquetes:', err);
            result(err, null);
        } else {
            console.log('Paquetes obtenidos correctamente:', data);
            result(null, data);
        }
    });
};

Package.create = (package, result) => {
    console.log('idCliente', package.clientId);
    const sqlFindLocker = `
        SELECT Id_Casillero 
        FROM tbl_casillero 
        WHERE Id_cliente = ? 
        LIMIT 1;
    `;

    db.query(
        sqlFindLocker,
        [package.clientId],
        (err, res) => {
            if (err) {
                console.error('Error al buscar el casillero:', err);
                result(err, null);
            } else {
                if (res.length === 0) {
                    console.error('No se encontró ningún casillero para el cliente:', package.idCliente);
                    result('No se pudo encontrar ningún casillero para el cliente', null);
                } else {
                    const idCasillero = res[0].Id_Casillero;
                    const sqlInsertPackage = `
                        INSERT INTO
                            tbl_paquete(
                                id_Casillero,
                                Cod_Tipo_Envio,
                                Peso_paquete,
                                Volumen_paquete,
                                Numero_Traking,
                                Descripcion_Paquete,
                                compra,
                                id_Tipo_Seguro,
                                Id_Estado_Envio,
                                Direccion_Envio,
                                Fecha_Entrega,
                                Fecha_pedido
                            )
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                    `;

                    db.query(
                        sqlInsertPackage,
                        [
                            idCasillero,
                            package.Cod_Tipo_Envio,
                            package.Peso_Real,
                            package.Peso_Volumen,
                            package.Dimensiones,
                            package.Numero_Traking,
                            package.Descripcion_Paquete,
                            package.compra,
                            package.id_Tipo_Seguro,
                            package.Id_Estado_Envio,
                            package.Direccion_Envio,
                            package.Fecha_Entrega,
                            package.Fecha_pedido,
                        ],
                        (err, res) => {
                            if (err) {
                                console.error('Error al insertar el paquete:', err);
                                result(err, null);
                            } else {
                                console.log('Id del nuevo paquete:', res.insertId);
                                result(null, res.insertId);
                            }
                        }
                    );
                }
            }
        }
    );
};


module.exports = Package;
