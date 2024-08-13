const nodemailer = require('nodemailer');

const sendMail = async (data, type) => {
    try {
        // Configuración del transporte
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'transportexpress504@gmail.com',
                pass: 'swlkjhhnjgluijgv'
            }
        });
         // Contenido del correo electrónico
        let mensaje;
        let asunto;
        if (type === "token") {
            // Correo con token
            mensaje = `
                <html>
                    <body>
                        <h1>Hola ${data.nombre},</h1>
                        <p>Aquí tienes tu token: <strong>${data.token}</strong></p>
                        <p>Utiliza este token para realizar tu acción.</p>
                    </body>
                </html>
            `;
            asunto = "Token de acceso";
          } else if (type === "bienvenida") {
            // Correo de bienvenida
            mensaje = `
                <html>
                    <body>
                        <h1>Bienvenido ${data.nombre},</h1>
                        <p>Gracias por registrarte en nuestro servicio.</p>
                        <p>Esperamos que disfrutes de tu experiencia con nosotros.</p>
                    </body>
                </html>
            `;
            asunto = "Bienvenido a nuestro servicio";
        }
        // Opciones del correo electrónico
        const mailOptions = {
            from: 'transportexpress504@gmail.com',
            to: data.email,
            subject: data.asunto,
            html: mensaje
        };

        // Enviar el correo electrónico
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado con éxito:', info.response);
        return true;
    } catch (error) {
        console.error('Error en el envío del mensaje:', error);
        throw error;
    }
};

module.exports = sendMail;