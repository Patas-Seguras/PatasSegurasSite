const nodemailer = require('nodemailer');
//esse aqui é o nodemailer criando o transportador que é o email que envia o email pra conta etc
const createTransport = () =>{
    return nodemailer.createTransport({ //retornando o nodemailer pra usar essa função no email de verificação abaixo.
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
                user: '4457f4e1372699',
                pass: '1d0f80787fd261'
            }
    });
}
const sendVerificationEmail = async (email, verificationToken) => {
    const transport = createTransport();
    //aqui ta o link que o usuario clica pra verificação, nao tem muita funcionalidade já que isso nao tem login
    const verificationLink = `http://localhost:8080/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
        
    //isso aqui é o codigo pra enviar o email
    await transport.sendMail({
        from: 'patas.seguras@hotmail.com',
        to: email,
        subject: 'Aqui está o link para verificar sua conta do Patas Seguras!',
        html: `<p>Clique no link para verificar seu e-mail: <a href="${verificationLink}">Verificar e-mail</a></p>`
    });
};

module.exports = {
    sendVerificationEmail
};