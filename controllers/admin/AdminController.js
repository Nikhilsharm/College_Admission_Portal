const CourseModel = require('../../models/course');
const UserModel= require('../../models/user');
const ContactModel=require('../../models/contact');
const bcrypt = require("bcrypt");
const nodemailer=require('nodemailer')

class AdminController{
  
  static dashboard=async(req,res)=>{
    try{
      const { name, image } = req.userData;
       res.render('admin/dashboard',{n:name,i:image})
    }catch(error){
        console.log(error)
    }
  }
  static displayStudent=async(req,res)=>{
    try{
      const{name,image} = req.userData
      const data= await UserModel.find()
      //console.log(data)

       res.render('admin/displaystudent',{d:data,n:name,i:image})
    }catch(error){
        console.log(error)
    }
  }

  static deleteStudent=async (req,res)=>{
    try{
      //console.log(req.params.id)
      
      await UserModel.findByIdAndDelete(req.params.id)
      res.redirect('/admin/studentdisplay')
    }catch(error){
      console.log(error)
    }
  }
  static viewStudent=async(req,res)=>{
    try{
      const{name,image} = req.userData
      const data= await UserModel.findById(req.params.id)
      //console.log(data)

       res.render('admin/student_view',{view:data,i:image,n:name})
    }catch(error){
        console.log(error)
    }
  }
  static editStudent=async(req,res)=>{
    try{
      const{name,image} = req.userData
      const id=req.params.id;
      const data= await UserModel.findById(id)
      //console.log(data)

       res.render('admin/student_edit',{edit:data,n:name,i:image})
    }catch(error){
        console.log(error)
    }
  }
  static studentUpdate=async(req,res)=>{
    try{
      const id=req.params.id;
      const {name,email,password}=req.body
      await UserModel.findByIdAndUpdate(id,{
        name,
        email,
        password
      })

      res.redirect('/admin/studentdisplay')
    }catch(error){
        console.log(error)
    }
  }
  static studentInsert=async(req,res)=>{
    try{
      //console.log(req.body)
      
      const {name,email,password}=req.body
      await UserModel.create({
        name,
        email,
        password
      })

       res.redirect('/admin/studentdisplay',)
    }catch(error){
        console.log(error)
    }
  }
  static Coursedisplay =async(req,res)=>{
    try{
      const {name, image} = req.userData;
      const course = await CourseModel.find()
      //console.log(course)

       res.render('admin/Coursedisplay',{c:course, n:name, i:image});
    }catch(error){
        console.log(error)
    }
  }
  static deleteCourse=async (req,res)=>{
    try{
      // console.log(req.params.id)
      await CourseModel.findByIdAndDelete(req.params.id)
      res.redirect('/admin/Coursedisplay')
    }catch(error){  
      console.log(error)
    }
  }
  static courseView =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const { name, image } = req.userData
        const data =await CourseModel.findById(req.params.id)
        //console.log(data)
        res.render('admin/course_view',{n:name,i:image,d:data,})
    }catch(error){
        console.log(error)
    }
}

static courseEdit =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const { name, image } = req.userData
        const data =await CourseModel.findById(req.params.id)
        //console.log(data)
        res.render('admin/course_edit',{n:name,i:image,d:data})
    }catch(error){
        console.log(error)
    }
}
  static update_status=async(req,res)=>{
    try{
      const id=req.params.id;
      const {name,email,course,status,comment}=req.body
      await CourseModel.findByIdAndUpdate(id,{
        status,
        comment
      })
     this.sendEmail(name,email,course,status,comment)
      res.redirect('/admin/Coursedisplay')
    }catch(error){
        console.log(error)
    }
  }
  static profile = async (req, res) => {
    try {
      const { name, email, image } = req.userData;
      res.render("admin/profile", {msg1: req.flash("success"), n: name, i: image, e: email });
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userData;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/admin/profile");
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => { 
    try {
      const { id } = req.userData;
      // const id=req.params.id;
      // console.log(id)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/admin/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/admin/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/admin/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static Contactdisplay =async(req,res)=>{
    try{
      const {name, image} = req.userData;
      const data = await ContactModel.find()
      //console.log(course)

       res.render('admin/Contactdisplay',{d:data, n:name, i:image});
    }catch(error){
        console.log(error)
    }
  };
  static sendEmail = async (name, email,course,status,comment) => {
    console.log(name,email,course)
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
        html: `<b>${name}</b> Course  <b>${course}</b> ${status} successful! ${comment} <br>
         `, // html body
    });
  };
}
module.exports=AdminController