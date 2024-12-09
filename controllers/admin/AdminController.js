const CourseModel = require('../../models/course');
const UserModel= require('../../models/user');
const ContactModel=require('../../models/contact');
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const nodemailer=require('nodemailer')

//Setup
cloudinary.config({
  cloud_name: "dyd2ggq1o",
  api_key: "644386558396377",
  api_secret: "TakkI8ejAb20i3UN5UhqpQTii4I",
});

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
      if (!name || !email || !password) {
        req.flash("error", "Please fill All Fields");
        return res.redirect("/admin/studentdisplay");
      }
      const isEmail = await UserModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "this email already register");
        return res.redirect("/admin/studentdisplay");
      }
      const file = req.files.image;
      //console.log(file)
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      const hashPassword = await bcrypt.hash(password, 10);
      await UserModel.create({
        name,
        email,
        password:hashPassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
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
      // console.log(course)

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
        // console.log(imageID);

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
  static deletecontact=async (req,res)=>{
    try{
      // console.log(req.params.id)
      await ContactModel.findByIdAndDelete(req.params.id)
      res.redirect('/admin/Contactdisplay')
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
 
  static getUsers = async (req, res) => {
    try {
      // await connectToDatabase();
      const {name, image} = req.userData;
      const now = new Date();
      const fourDaysAgo = new Date(now.setUTCDate(now.getUTCDate() - 4));
      const startOfDay = new Date(fourDaysAgo.setUTCHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(fourDaysAgo.setUTCHours(23, 59, 59, 999)).getTime(); // Ensure database connection
      const data = await CourseModel.find()
        // {
        //   timestampField: {
        //     $gte: startOfDay,
        //     $lt: endOfDay
        //   },
        //   status: "pending"
        // }
        // console.log(data)
        // Fetch all users
        res.json(data);
         // Send users as JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};
}
module.exports=AdminController