const db = require('../config/config');

//siguiendo encriptar contraseña

const bcrypt = require('bcryptjs');

const User = {};

User.findById = (clientId, result) => {
    const sql = `
        SELECT
            id_cliente,
            nombre,
            apellido,
            correo_cliente,
            telefono,
            direccion,
            dni,
            fecha_registro,
            password
        FROM
            tbl_cliente
        WHERE 
            id_cliente = ?
    `;

    db.query(sql, [clientId], (err, user) => {
        if (err) {
            console.error('Error al buscar usuario por ID en la base de datos:', err);
            return result(err, null);
        }
        
        if (!user || user.length === 0) {
            console.log('Usuario no encontrado');
            return result(null, null);
        }

        console.log('Usuario encontrado:', user[0]);
        result(null, user[0]);
    });
};





User.findByEmail = (email, result) => {
    const sql = `
        SELECT
            id_cliente,
            nombre,
            apellido,
            correo_cliente,
            telefono,
            direccion,
            dni,
            fecha_registro,
            password
        FROM
            tbl_cliente
        WHERE 
            correo_cliente = ?
    `;

    db.query(
        sql, 
        [email], 
        (err, user) => {
        if (err) {
            console.log('Error al buscar usuario por correo electrónico en la base de datos:', err);
            result(err, null);
        }else{
            console.log('Usuario Obtenido', user[0]);
            result(null, user[0]);
        }
    });
};


User.findByEmailR = (email, callback) => {
    const sql = `
        SELECT
            id_cliente
        FROM
            tbl_cliente
        WHERE 
            correo_cliente = ?
    `;

    db.query(sql, [email], (err, user) => {
        if (err) {
            console.log('Error al buscar usuario por correo electrónico en la base de datos:', err);
            callback(err, null);
        } else {
            console.log('Usuario Obtenido:', user[0]);
            callback(null, user[0]);
        }
    });
};



User.create = async (user, result) => {

//siguiendo encriptar contraseña

const hash = await bcrypt.hash(user.password, 10);


    const sql = `
      INSERT INTO
        tbl_cliente(
            nombre,
            apellido,
            correo_cliente,
            telefono,
            direccion,
            dni,
            fecha_registro,
            password
        )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)
`;

db.query
    (
        sql,
        [
            user.nombre,
            user.apellido,
            user.correo_cliente,
            user.telefono,
            user.direccion,
            user.dni,
            user.fecha_registro,
            hash
            
        ], 

        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo usuario:', res.insertId);
                result(null, res.insertId);
            }
        }

    )

}

// Método para actualizar la contraseña del usuario
User.updatePasswordByEmail = async (email, newPassword, callback) => {
    try {
        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar la contraseña en la base de datos
        const sql = `
            UPDATE
                tbl_cliente
            SET
                password = ?
            WHERE
                correo_cliente = ?
        `;
        db.query(sql, [hashedPassword, email], (err, result) => {
            if (err) {
                console.log('Error al actualizar la contraseña del usuario:', err);
                callback(err, null);
            } else {
                console.log('Contraseña actualizada exitosamente');
                callback(null, result);
            }
        });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        callback(error, null);
    }
};


// Función para actualizar la información del usuario
User.updateUserInfo = async (clientId, nombre, apellido, correo_Cliente, direccion, telefono, callback) => {
    try {
        // Realizar la actualización en la base de datos
        const sql = `
            UPDATE
                tbl_cliente
            SET
                nombre = ?,
                apellido = ?,
                correo_cliente = ?,
                direccion = ?,
                telefono = ?
            WHERE
                id_cliente = ?
        `;
        db.query(sql, [nombre, apellido, correo_Cliente, direccion, telefono, clientId], (err, result) => {
            if (err) {
                console.error('Error al actualizar la información del usuario en la base de datos:', err);
                callback(err, null);
            } else {
                console.log('Información del usuario actualizada correctamente');
                callback(null, result);
            }
        });
    } catch (error) {
        console.error('Error al actualizar la información del usuario:', error);
        callback(error, null);
    }
};


module.exports = User;
