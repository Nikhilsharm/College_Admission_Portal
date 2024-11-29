const ContactModel = require('../../models/contact');
const nodemailer=require('nodemailer')

class ContactController {
  static insertContact = async (req, res) => {
    try {
        const {name,email,phone,message} = req.body
        await ContactModel.create({
          name,
          email,
          phone,
          message
        })
        req.flash("success", "Contact Successful");
        this.sendEmail(name,email,)
        res.redirect('/contact')
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email,message) => {
    // console.log(name,email,course)
    // connenct with the smtp server
  
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
  
      auth: {
        user: "purohitwork2002@gmail.com",
        pass: "exya rouj blzs uwtm",
      },
    });
    let info = await transporter.sendMail({
        from: "test@gmail.com", // sender address
        to: email, // list of receivers
        subject: ` Complain`, // Subject line
        text: "heelo", // plain text body
        html: ` <b>${name}</b> your message:<b>${message}</b> has been Registered seccessfully.<br>
         `, // html body
    });
  };
}

module.exports = ContactController;