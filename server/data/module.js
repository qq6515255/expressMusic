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
// 文章
var contentSchema = new mongoose.Schema({
  title: String,
  category: String,
  author: {
    type: String,
    default: "admin"
  },
  content: String,
  time: {
    type: String,
    default: Date.now()
  },
  views: {
    type: Number,
    default: 0
  },
  like: {
    type: Number,
    default: 0
  },
  comment: {
    type: Array,
    default: []
  }
});

Model = {
  Users: mongoose.model("Users", userSchema),
  User: mongoose.model("Admin", adminSchema),
  Category: mongoose.model("Category", categorySchema),
  Content: mongoose.model("Content", contentSchema),
  Banner: mongoose.model("Banner", bannerSchema)
};
module.exports = Model;
