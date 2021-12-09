const nodeMailer=require('nodemailer');
const config=require('config');


const transporter=nodeMailer.createTransport({
    service: 'gmail',
    port: 587,
    // secure: false, // true for 587, false for other ports
    //requireTLS: true,
    auth: {
        user: config.get('mailSender'), 
        pass: config.get('mailSenderPassword'), 
    },
    // secureConnection: 'false',
    // tls: {
    //     ciphers: 'SSLv3'
    // }
});


const sendEmail=async(sendTo, emailSubject, emailText)=>{
let mailOptions={
    from:'f178161@nu.edu.pk',
    to:sendTo,
    subject:emailSubject,
    text:emailText
};

transporter.sendMail(mailOptions, (error, info)=>{
    if(error) return console.log(error);
    console.log(info);
});

}

module.exports=sendEmail;