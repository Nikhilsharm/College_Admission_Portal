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
        this.sendEmail(name,email,message)
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
        html: ` 
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border: 1px solid #dddddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
            }
            .email-body {
                font-size: 16px;
                color: #333333;
                margin-bottom: 20px;
            }
            .email-footer {
                font-size: 14px;
                color: #777777;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">Message Registered Successfully</div>
            <div class="email-body">
                <p>Hi <b>${name}</b>,</p>
                <p>Your message: <b>${message}</b> has been registered successfully.</p>
                <p>We appreciate your input and will get back to you shortly if necessary.</p>
            </div>
            <div class="email-footer">
                Thank you,<br>
                The Support Team
            </div>
        </div>
    </body>
    `,
    });
  };
}

module.exports = ContactController;