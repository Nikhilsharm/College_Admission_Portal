const CourseModel = require('../models/course')
const nodemailer=require('nodemailer')

class CourseController {

  static Courseinsert = async (req, res) => {
    try {
      const { id } = req.userData
      const { name, email, phone, dob, address, gender, education, course } = req.body
      const isEmail = await CourseModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "Already applied from this email");
        return res.redirect("/home");
      }
      const result = await CourseModel .create({
        name,
        email,
        phone,
        dob,
        address,
        gender,
        education,
        course,
        user_id: id
      });
      this.sendEmail(name,email,course)
      res.redirect('/courseDisplay')
    } catch (error) {
      console.log(error)
    }
  }

  static courseDisplay = async (req, res) => {
    try {
      const { name, image, id } = req.userData
      const course = await CourseModel.find({ user_id: id })
      res.render('course/display', { n: name, i: image, c: course })
    } catch (error) {
      console.log(error)
    }
  }
  static courseView =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const { name, image ,role} = req.userData
        const data =await CourseModel.findById(req.params.id)
        //console.log(data)
        res.render('course/view',{n:name,i:image,d:data,r:role})
    }catch(error){
        console.log(error)
    }
}

static courseEdit =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const { name, image,role } = req.userData
        const data =await CourseModel.findById(req.params.id)
        //console.log(data)
        res.render('course/edit',{n:name,i:image,d:data,r:role})
    }catch(error){
        console.log(error)
    }
}
static courseUpdate =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const {name,email,phone,dob,address,gender,education,course} =req.body
        const { image } = req.userData
        await CourseModel.findByIdAndUpdate(req.params.id,{
            name:name,
            email:email,
            phone:phone,
            dob:dob,
            gender:gender,
            address:address,
            education:education,
            course:course
        })
        //console.log(data)
        req.flash('success', 'Course Update Successfully.')
        res.redirect('/courseDisplay')
    }catch(error){
        console.log(error)
    }
}

static courseDelete =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const { name, image } = req.userData
        await CourseModel.findByIdAndDelete(req.params.id)
        //console.log(data)
        req.flash('success', 'Course Delete Successfully.')
        res.redirect('/courseDisplay')
    }catch(error){
        console.log(error)
    }
}
static sendEmail = async (name, email,course) => {
//   console.log(name,email,course)
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
      subject: ` Course ${course}`, // Subject line
      text: "heelo", // plain text body
      html: `<head>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
               /* Replace with your image URL */
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              margin: 0;
              padding: 0;
          }
          .email-container {
              margin: 0 auto;
              padding: 20px;
              max-width: 600px;
              background: rgba(255, 255, 255, 0.9); /* Optional: Add transparency for readability */
              border: 1px solid #ccc;
              border-radius: 5px;
          }
          .email-header {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
          }
          .email-body {
              margin-bottom: 20px;
          }
          .email-footer {
              font-size: 14px;
              color: #555;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">Course Enrollment Successful</div>

          <div class="email-body">
              <p><b>${name}</b>,</p>

              <p>Your enrollment in the course <b>${course}</b> has been successfully processed!</p>

              <p>We are excited to have you on board. Please feel free to reach out if you have any questions or need assistance.</p>
          </div>

          <div class="email-footer">
              Thank you,<br>
              The Support Team
          </div>
      </div>
  </body>
       `, // html body
  });
};
}
module.exports = CourseController