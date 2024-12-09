const mongoose = require("mongoose");
//const mongoURL=mongoose.connect("mongodb://127.0.0.1:27017/admissionPortal")
const URL="mongodb+srv://purohitwork2002:n9713860886@cluster0.lq5ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongoURL=mongoose.connect(URL)
const connectDB = () => {
  return mongoURL

    .then(() => {
      console.log("connect db"); 
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = connectDB;
