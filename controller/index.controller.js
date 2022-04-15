const nodemailer = require('nodemailer')
const cron = require('node-cron')

//@ desc: Status Check
//@route: GET
const statusCheck = (req, res) =>{
    res.status(200).send('Okay')
}

const index = (req, res) => {
    return res.render('../views/index.ejs')
}

const sendmailHandler = async (req, res) => {
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_ADDR, // Gmail Address
        pass: process.env.MAIL_PWD, // Gmail Password
      },
      tls:{
        rejectUnauthorized: false
      }
      
    });
    
    let info = await transporter.sendMail({
      from: '"Hey Future me 👻" <fromyourpasttopresent@gmail.com>', // sender address
      to: req.body.email, // email inputed on the client
      subject: "Hey Future me ✔", // Subject line
      text: req.body.message, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    return res.redirect('/')
}

module.exports = {
    statusCheck, index, sendmailHandler
}