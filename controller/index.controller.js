const nodemailer = require('nodemailer')
const cron = require('node-cron')
const Mail = require('../models/mail.model')
const schedule = require('node-schedule');
const { process_params } = require('express/lib/router');

//@ desc: Status Check
//@route: GET
const statusCheck = (req, res) =>{
  /* res.status(200).send('Okay') */
  /* var ddate = req.body.date;
  var newDate = new Date(req.body.date)

  console.log(ddate)
  console.log(newDate) */

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
  const { email, message, date } = req.body

  await Mail.create({
    email,
    message,
    date
  })

  if(mail){
    let transporter = nodemailer.createTransport({
      service: 'gmail',
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

    schedule.scheduleJob('* * * * *', ()=> {
      if(mail.date === new Date()){
        transporter.sendMail(mailOptions, (error, info) => {
          if(error){
            return console.log(error)
          }
          console.log('Message %s sent: %s', info.messageId, info.response);

          if(info){
            console.log('Job Sent... Job will now be cancelled')
            schedule.gracefulShutdown()
          }
        })
      }
      else if(mail.date !== new Date()){
        transporter.sendMail(mailOptions, (err, info) => {
          if(err){
            return console.log(err)
          }
          console.log('Message %s sent: %s', info.messageId, info.response);

          if(info){
            console.log('Job Sent... Job will now be cancelled')
            schedule.gracefulShutdown()
          }
        })
      }
      return res.status(400).send({error: 'Something went wrong in the logic'})
    })
  }
  return res.status(400).send({message: 'An error occured somewhere'})

}






module.exports = {
    statusCheck, index, sendmailHandler, mailHandler
}