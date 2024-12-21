const express = require("express");
// console.log(express)
const app = express();
const web = require("./routing/web");
const connectDB = require("./db/connectDB");
const fileUpload = require("express-fileupload");
let cookieParser = require("cookie-parser");
require('dotenv').config();
const Port =process.env.port || 3000;
 
//token get
app.use(cookieParser());

//connect flash and session
const session = require("express-session");
const flash = require("connect-flash");
//messages
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
// Cache control middleware
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  // res.set('Pragma', 'no-cache');
  // res.set("Expires", "0");
  next();
});

//Flash messages
app.use(flash());

// ejs (html css)
app.set("view engine", "ejs");

// css image link public
app.use(express.static("public"));

//image uppload
app.use(
  fileUpload({
    useTempFiles: true,
    // tempFileDir : '/tmp/'
  })
);

///connecting with mongoose db
connectDB();

// parse application/x-www-form-urlencoded   ( body parser link se liya hai)
app.use(express.urlencoded({ extended: false }));

//Routing
app.use("/", web);

// server start
app.listen(Port, console.log("server start localhost:3000"));