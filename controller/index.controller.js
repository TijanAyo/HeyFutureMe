const nodemailer = require('nodemailer')
const cron = require('node-cron')
const Mail = require('../models/mail.model')
const schedule = require('node-schedule');
const { process_params } = require('express/lib/router');
const {mailSchema} = require('../schema/mail.schema')

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

const mailHandler = async ( req, res) => {
  try{
    await mailSchema.validateAsync(req.body)

    const mail = await Mail.create({
      email: req.body.email,
      message: req.body.message,
      date:req.body.date
    })
  
    if(mail){
      let transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_ADDR,
          pass: process.env.MAIL_PWD,
        },
        tls:{
          rejectUnauthorized: false
        }
        
      });
  
      let mailOptions = {
        from: '"Hey Future me 👻" <fromyourpasttopresent@gmail.com>', // sender address
        to: req.body.email, // email inputed on the client
        subject: "Hey Future me ✔", // Subject line
        text: req.body.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
      }
  
    
      const ddate = req.body.date
      const D = new Date(ddate)
      
      const month = D.getUTCMonth()
      const dateday = D.getDate()
      const year = D.getFullYear()
      const dateweek = D.getDay()
    
    
      schedule.scheduleJob({dayOfWeek: dateweek, year: year, month: month, date: dateday}, () =>{
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
    
          if (info){
            console.log('Job Sent... Job will now be cancelled')
            schedule.gracefulShutdown()
            /* .then(() => process.exit(0)) */
          }
          return res.redirect('/')
        });
      })
    }
  }catch(err){
    return res.json(err.message).status(422)
  }

}

module.exports = {
  statusCheck, index, sendmailHandler, mailHandler
}