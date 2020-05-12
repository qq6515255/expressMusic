var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/tao", { useMongoClient: true });

// 管路员用户
var adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  time: {
    type: String,
    default: Date.now()
  }
});
var bannerSchema = new mongoose.Schema({
  imgURl: String,
  link: String,
  title: {
    type: String,
    default: `Xian'Music`
  },
  status: {
    type: String,
    default: 1 //1启用0禁用
  },
  time: {
    type: String,
    default: Date.now()
  }
});
// 用户
var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  nickName: String,
  type: String,
  token: String,
  avatar: String
});
// 分类
var categorySchema = new mongoose.Schema({
  title: String,
  time: {
    type: String,
    default: Date.now()
  }
});
// 歌曲
var songSchema = new mongoose.Schema({
  title: String,
  al:{
    type:Object,
    default:{}
  },
  artist:{
    type: String,
    default: ''
  },
  lrc:{
    type: String,
    default: ''
  },
  publishTime:{
    type: String,
    default: ''
  },
  singerId:{
    type:Number,
    default:null
  },
  pic:{
    type: String,
    default: ''
  },
  src:{
    type: String,
    default: ''
  },
  title:{
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: Date.now()
  }
});
// 内容
var contentSchema = new mongoose.Schema({
  title: String,
  category: String,
  author: {
    type: String,
    default: "admin"
  },
  content: String,//描述
  time: {
    type: String,
    default: Date.now()
  },
  cover:String,
  views: { //点击次数
    type: Number,
    default: 0
  },
  like: {
    type: Number,
    default: 0
  },
  songs:Object, //歌曲
  comment: { //评论
    type: Array,
    default: []
  }
});

Model = {
  Users: mongoose.model("Users", userSchema),
  User: mongoose.model("Admin", adminSchema),
  Category: mongoose.model("Category", categorySchema),
  Content: mongoose.model("Content", contentSchema),
  Banner: mongoose.model("Banner", bannerSchema),
  Song: mongoose.model("Song", songSchema)
};
module.exports = Model;
