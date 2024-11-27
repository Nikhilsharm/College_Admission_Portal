const mongoose = require("mongoose");
const mongoURL=mongoose.connect("mongodb://127.0.0.1:27017/admissionPortal")
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
