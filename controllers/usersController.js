//const { sign } = require('jsonwebtoken');
const User = require('../models/user');
const ResetToken = require('../models/resetToken');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const keys = require ('../config/keys');
const Correos = require('./Correos');


module.exports =  {
// Función para solicitar restablecimiento de contraseña
async requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        console.log('Solicitud de restablecimiento de contraseña recibida para el correo electrónico:', email);
        if (!email) {
            return res.status(401).json({ message: 'Se requiere una dirección de correo electrónico válida' });
        }
        const token = await ResetToken.generateAndSaveToken();
        await ResetToken.enviarCodigoVerificacion(email, token);
        res.status(201).json({ success: true, message: 'Correo electrónico de restablecimiento de contraseña enviado' });
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        res.status(501).json({ success: false, message: 'Error al solicitar restablecimiento de contraseña' });
    }
},


    // Función para cambiar la contraseña del usuario
async changePassword(req, res) {
    try {
        const { email, newPassword, token } = req.body; // Obtener el email y la nueva contraseña del cuerpo de la solicitud

        // Verificar la validez del token
        const isTokenValid = await ResetToken.checkTokenValidity(token);
        if (!isTokenValid) {
            return res.status(400).json({ success: false, message: 'El token no es válido o ha expirado' });
        }
        
        // Actualizar la contraseña del usuario en la base de datos
        User.updatePasswordByEmail(email, newPassword, (err, result) => {
            if (err) {
                    // Manejar errores
                    console.error('Error al cambiar la contraseña:', err);
                    return res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
                } else {
                    // Si la actualización se realiza correctamente
                    return res.status(200).json({ success: true, message: 'Contraseña actualizada exitosamente' });
                }
        });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
    }
},




    login(req, res) {
        const email = req.body.correo_cliente;
        const password = req.body.password;
    
        User.findByEmail(email, async (err, myUser) => {
            if (err) {
                console.error('Error al buscar el usuario:', err);
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'el email no fue encontrado'
                });
            }
    
            const isPasswordValid = await bcrypt.compare(password, myUser.password);
            if (isPasswordValid) {
                const token = jwt.sign({id: myUser.id_cliente, email: myUser.correo_cliente}, keys.secretOrKey, {});
                const data = { 
                    id_cliente: myUser.id_cliente,
                    nombre: myUser.nombre,
                    apellido: myUser.apellido,
                    correo_cliente: myUser.correo_cliente,
                    telefono: myUser.telefono,
                    direccion: myUser.direccion,
                    dni: myUser.dni,
                    fecha_registro: myUser.fecha_registro,
                    session_token: `JWT ${token}`
                };
                return res.status(201).json({
                    success: true,
                    message: 'el usuario fue autenticado',
                    data: data
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            }
            
        });
    },
    

    register(req, res) {
        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        try {
            // Verificar si se proporcionó un correo electrónico en la solicitud
            if (!user.correo_cliente) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere una dirección de correo electrónico'
                });
            }
    
            // Verificar si el correo electrónico ya está registrado
            User.findByEmailR(user.correo_cliente, async (err, existingUser) => {
                if (err) {
                    console.error('Error al buscar el usuario en la base de datos:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Hubo un error al buscar el usuario en la base de datos.'
                    });
                }
                if (existingUser) {
                    return res.status(401).json({
                        success: false,
                        message: 'El correo electrónico ya está registrado.'
                    });
                }
    
                // Crear un nuevo usuario en la base de datos
                User.create(user, async (err, data) => {
                    if (err) {
                        console.error('Error al crear el usuario:', err);
                        return res.status(501).json({
                            success: false,
                            message: 'Hubo un error con el registro del usuario.',
                            error: err
                        });
                    }
                    // Enviar correo electrónico de bienvenida al nuevo usuario
                    const mail = {
                        para: user.correo_cliente,
                        titulo: '¡Bienvenido a la aplicación TraEx!',
                        html: `
                            <p>Estimado(a) ${user.nombre} ${user.apellido},</p>
                            <br>
                            <p>Nos complace darle la bienvenida a la aplicación TraEx, su solución integral para la gestión eficiente de envíos.</p>
                            <p>En TraEx, nos comprometemos a proporcionarle un servicio de calidad excepcional, diseñado para satisfacer todas sus necesidades de envío de manera rápida, segura y confiable.</p>
                            <p>Al unirse a nuestra plataforma, tendrá acceso a una amplia gama de servicios y herramientas innovadoras que facilitarán y mejorarán su experiencia de envío.</p>
                            <br>
                            <p>¡Gracias por elegirnos como su socio de confianza en el mundo de los envíos!</p>
                            <br>
                            <p>Atentamente,</p>
                            <p>El equipo de TraEx</p>
                        `
                    };
                    try {
                        await Correos.enviarCorreo(mail);
                        // Respondemos con éxito y un mensaje
                        return res.status(201).json({
                            success: true,
                            message: 'El registro se realizó correctamente. Se ha enviado un correo electrónico de bienvenida.',
                            data: data // El ID DEL NUEVO USUARIO QUE SE REGISTRÓ
                        });
                    } catch (emailError) {
                        console.error('Error al enviar el correo electrónico:', emailError);
                        return res.status(500).json({
                            success: false,
                            message: 'Hubo un error al enviar el correo electrónico de bienvenida.'
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Hubo un error al registrar el usuario. Por favor, inténtelo de nuevo más tarde.'
            });
        }
    },


  // Función para obtener un usuario por su ID
  async getUserById(req, res) {
    try {
        const clientId = req.params.clientId; 
        const user = await new Promise((resolve, reject) => {
            User.findById(clientId, (err, user) => {
                if (err) {
                    console.error('Error al obtener el usuario por ID:', err);
                    reject(err);
                }
                if (!user) {
                    console.log('Usuario no encontrado');
                    resolve(null);
                }
                resolve(user);
            });
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        return res.status(200).json({ success: true, message:"Usuario encontrado", data: user });
    } catch (error) {
        console.error('Error al obtener el usuario por ID:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener el usuario por ID' });
    }
},

 // Función para actualizar la información del usuario
 async updateUserInfo(req, res) {
    try {
      const clientId = req.params.clientId; // Obtener el ID del usuario de los parámetros de la URL
      const { nombre, apellido, correoCliente, direccion, telefono } = req.body; // Obtener los datos actualizados del cuerpo de la solicitud

      // Llamar al método correspondiente en el modelo de usuario para actualizar la información del usuario
      User.updateUserInfo(clientId, nombre, apellido, correoCliente, direccion, telefono, (err, result) => {
        if (err) {
          console.error('Error al actualizar la información del usuario:', err);
          return res.status(500).json({ success: false, message: 'Error al actualizar la información del usuario' });
        } else {
          // Si la actualización se realiza correctamente, enviar una respuesta exitosa al cliente
          return res.status(200).json({ success: true, message: 'Información del usuario actualizada correctamente' });
        }
      });
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
      return res.status(500).json({ success: false, message: 'Error al actualizar la información del usuario' });
    }
  }

}
