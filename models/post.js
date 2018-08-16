const mongoose = require("mongoose")

const PostSchema = mongoose.Schema({
  title : String,
  filename : String,
  originalfilename: String
}, {
  timestamps:true
})

const Post = mongoose.model("post", PostSchema)

module.exports = {
  Post
}
