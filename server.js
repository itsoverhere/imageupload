const express = require("express")
const multer = require("multer")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const path = require("path")
const {Post} = require("./models/post.js")
const hbs = require("hbs")
const fs = require("fs")

const app = express()
const urlencoder = bodyparser.urlencoded({
  extended:false
})

// This is required for the uploads:
// multer is our middleware, it saves files uploaded by the user
// UPLOAD_PATH assumes we have an "uploads" folder in our current directory
// dest is the path where the files will be saved
// limits are options, in this case, file must not be larger than 1000000 bytes, and we can only upload 2 at a time
const UPLOAD_PATH = path.resolve(__dirname, "uploads")
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

app.use(express.static(__dirname + "/public"))

app.set("view engine", "hbs")

mongoose.connect("mongodb://localhost:27017/imageupload", {
  useNewUrlParser :true
})

app.get("/", (req,res)=>{
  res.sendFile(__dirname + "/index.html")
})

// this should be in controller post
// we use the multer middleware where
// "img" must match the name attribute of the <input type="file">
// we can access what multer saved through the req.file object
// req.file.filename = name that multer assigned to the saved image
// req.file.originalname = original name of the file from user's computer
app.post("/upload", upload.single("img"),(req, res)=>{
  console.log(req.body.title)
  console.log(req.file.filename)

  // multer saves the actual image, and we save the filepath into our DB
  var p = new Post({
      title : req.body.title,
      filename : req.file.filename,
      originalfilename : req.file.originalname
    })

  p.save().then((doc)=>{
      res.render("post.hbs", {
        title : doc.title,
        id : doc._id
      })
    })
})

// this should be in controller post
app.get("/photo/:id", (req, res)=>{
  console.log(req.params.id)
  Post.findOne({_id: req.params.id}).then((doc)=>{
    fs.createReadStream(path.resolve(UPLOAD_PATH, doc.filename)).pipe(res)
  }, (err)=>{
    console.log(err)
    res.sendStatus(404)
  })
})

// Still need to convert to MVC

app.listen(3002)
