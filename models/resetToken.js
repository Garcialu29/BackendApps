const jwt = require('jsonwebtoken');
const Correos  = require('../controllers/Correos');
const db = require('../config/config');

const ResetToken = {};

ResetToken.generateAndSaveToken = async () => {
    try {
        // Generar el código de verificación
        const codigoVerif = ResetToken.generarCodigo(); 
        
        // Calcular la fecha de expiración (5 minutos a partir de ahora)
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 10);
        
        // Insertar el token en la base de datos junto con la fecha de expiración
        const sql = `
            INSERT INTO tbl_reset_tokens (token, expiry_time)
            VALUES (?, ?)
        `;
        await db.execute(sql, [codigoVerif, expirationDate]); 
        
        // Imprimir mensaje de éxito
        console.log('Token de restablecimiento creado con éxito');
        
        // Devolver el token generado
        return codigoVerif; 
    } catch (error) {
        console.error("Error al guardar el token:", error);
        throw error;
    }
},

ResetToken.enviarCodigoVerificacion = async (email, token) => {
    try {
        if (!email || !token) {
            throw new Error("Faltan datos requeridos para enviar el código de verificación");
        }

       // Construir el correo electrónico de recuperación de contraseña
const mail = {
    para: email,
    titulo: "Recuperación de contraseña",
    html: `
        <html>
            <body>
                <p>Estimado(a) usuario,</p>
                <br>
                <p>Recientemente solicitó restablecer su contraseña para acceder a su cuenta en nuestra plataforma.</p>
                <p>A continuación, encontrará su código de verificación:</p>
                <br>
                <h2 style="color: #1E90FF; font-size: 24px;">${token}</h2>
                <br>
                <p>Por favor, utilice este código para completar el proceso de recuperación de contraseña.</p>
                <p>Si no solicitó esta acción, puede ignorar este mensaje de correo electrónico de manera segura.</p>
                <br>
                <p>Atentamente,</p>
                <p>El equipo de soporte de Transpor Express</p>
            </body>
        </html>
    `,
};
        // Envía el correo electrónico
        await Correos.enviarCorreo(mail);

        // Si el correo se envía correctamente, no es necesario devolver nada
    } catch (error) {
        // Maneja el error al enviar el correo electrónico
        console.error("Error al enviar el código de verificación:", error);
        throw error; // Reenvía el error para que pueda ser manejado por el controlador
    }
},



ResetToken.generarCodigo = () => {
    const longitud = 6;
    const caracteres = "0123456789";
    let codigo = "";

    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[indice];
    }

    return codigo;
}

/*ResetToken.generarSecretoUsuario = (usuario) => {
    const secretoBase = "secreto_super_seguro";
    return secretoBase + usuario;
};*/

ResetToken.checkTokenValidity = async (token) => {
    try {
        const sql = `
            SELECT expiry_time
            FROM tbl_reset_tokens
            WHERE token = ? AND expiry_time > NOW()
        `;
        const rows = await db.execute(sql, [token]);
        if (rows.length === 0) {
            return false; // El token no es válido o ha expirado
        }
        return true; // El token es válido y aún no ha expirado
    } catch (error) {
        console.error('Error al verificar la validez del token:', error);
        throw error;
    }
};




module.exports = ResetToken;
