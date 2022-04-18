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
  
  try{
    const { email, message, date } = req.body

    const mail = await Mail.create({
      email,
      message,
      date
    })

    var ddate = req.body.date
    var D = new Date(ddate)
    
    var month = D.getUTCMonth()
    /* console.log(month + ' month') */

    var dateday = D.getDate()
    /* console.log(day_of_month) */

    var year = D.getFullYear()
    /* console.log(year) */

    /* cron.schedule(`* * ${day_of_month} ${month} ${year}`, () => {
      console.log('mail sent...')
    }) */

  
    schedule.scheduleJob({hour: 14, minute: 50, dayOfWeek: 1, year: year, month: month, date: dateday}, () =>{

      let info = transporter.sendMail({
        from: '"Hey Future me 👻" <fromyourpasttopresent@gmail.com>', // sender address
        to: req.body.email, // email inputed on the client
        subject: "Hey Future me ✔", // Subject line
        text: req.body.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      if (info){
        console.log('Job Sent... Job will now be cancelled')
        schedule.gracefulShutdown()
        /* .then(() => process.exit(0)) */
      }
      return res.redirect('/')

    
    })
  }
  catch(error){
    console.log(error)
    process.exit(1)
  }
}
module.exports = {
    statusCheck, index, sendmailHandler, mailHandler
}