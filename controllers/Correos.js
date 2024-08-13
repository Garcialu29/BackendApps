const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "transportexpress504@gmail.com",
        pass: "hefmrejtodfrxroa"
    }
});

const Correos = {
    enviarCorreo: async (mail) => {
        try {
            //console.log(req.body);
            
            if (!mail || !mail.para || !mail.titulo || !mail.html) {
                throw new Error('Faltan datos requeridos para enviar el correo');
            }

            const mailOptions = {
                from: "transportexpress504@gmail.com",
                to: mail.para,
                subject: mail.titulo,
                html: mail.html,
            };
            await transporter.sendMail(mailOptions);
            
        } catch (error) {
            console.error('Error al enviar correo:', error);
            //res.status(500).json({ message: 'Error al enviar correo' });
            throw error;
        }
    }
};

module.exports = Correos;
