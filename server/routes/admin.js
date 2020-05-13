var express = require("express");
var fs = require("fs");
var config = require("../config");
var router = express.Router();
var Model = require("../data/module");
var url = require("url");
const path = require("path");
const mp = require("connect-multiparty");
const multipartyMiddleware = mp();
const os = require("os");
const UPLOADPATH = "../public/banner";
// 所有请求都要经过这一步，统一请求返回的数据格式
var responseData;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ""
  };
  next();
});
// 定义时间格式
var date = new Date(),
  yy = date.getFullYear(),
  MM = date.getMonth() + 1,
  dd = date.getDate(),
  hh = date.getHours(),
  mm = date.getMinutes(),
  ss = date.getSeconds();
var time = yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("localhost:3000/admin首页");
});

router.use(function (req, res, next) {
  console.log(req.userInfo);
  if (!req.cookies.userInfo) {
    responseData.code = 1;
    responseData.message = "没有登录";
    res.json(responseData);
    return;
  }
  next();
});

// 查找所有用户
router.get("/admin_users", function (req, res, next) {
  var page = Number(req.query.page || 1);
  // var test = JSON.stringify(req);
  var limit = 4;
  var pages = 0;
  Model.Users.count().then(function (count) {
    pages = Math.ceil(count / limit); //总数据除以每页限制数据=页数
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    var skip = (page - 1) * limit;

    Model.Users.find({})
      .limit(limit)
      .skip(skip)
      .then(function (doc) {
        console.log("doc==>", doc);
        responseData.code = 200;
        responseData.message = "查找所有用户成功";
        responseData.data = doc;
        responseData.count = count;
        responseData.limit = limit;
        responseData.page = page;
        responseData.pages = pages;
        responseData.skip = skip;
        // path.join(__dirname, "20200507140023.jpg")
        console.log(responseData);
        res.json(responseData);
      });
  });
});
//

// 删除用户
router.post("/admin_users_del", function (req, res, next) {
  var _id = req.body._id;
  Model.Users.remove({
    _id: _id
  }, function (err, doc) {
    if (err) {
      conosle.log(err);
      return;
    } else {
      responseData.code = "200";
      responseData.message = "删除成功";
      res.json(responseData);
      return;
    }
  });
});

// 查找所有分类
router.get("/admin_category", function (req, res, next) {
  var page = Number(req.query.page || 1);
  var limit = 4;
  var pages = 0;
  Model.Category.count().then(function (count) {
    pages = Math.ceil(count / limit); //总数据除以每页限制数据=页数
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    var skip = (page - 1) * limit;

    Model.Category.find({})
      .sort({
        _id: -1
      })
      .limit(limit)
      .skip(skip)
      .then(function (doc) {
        // console.log(doc);
        responseData.code = 200;
        responseData.message = "查找所有分类成功";
        responseData.data = doc;
        responseData.count = count;
        responseData.limit = limit;
        responseData.page = page;
        responseData.pages = pages;
        responseData.skip = skip;
        console.log(responseData);
        res.json(responseData);
      });
  });
});

// 分类增加
router.post("/admin_category_add", function (req, res, next) {
  var categoryName = req.body.categoryName;
  console.log("新的分类名为:" + categoryName);
  newCategory = {
    title: categoryName,
    time: yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss
  };
  Model.Category.findOne({
    title: categoryName
  }, function (doc) {
    if (doc) {
      responseData.code = 1;
      responseData.message = "分类名已经存在";
      res.json(responseData);
      return;
    } else {
      Model.Category.create(newCategory, function (doc) {
        responseData.code = 200;
        responseData.message = "增加新的分类成功";
        responseData.data = doc;
        res.json(responseData);
      });
    }
  });
});

// 分类删除
router.post("/admin_category_del", function (req, res, next) {
  var _id = req.body._id;
  Model.Category.remove({
    _id: _id
  }, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.send(doc);
    }
  });
});

// 点击修改跳转到分类修改页面
router.get("/admin_category_update", function (req, res, next) {
  var _id = req.query._id;
  Model.Category.findOne({
    _id: _id
  }, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      responseData.code = 200;
      responseData.message = "查询分类修改id成功";
      responseData.data = doc;
      res.json(responseData);
    }
  });
});

// 分类修改
router.post("/admin_category_update", function (req, res, next) {
  var _id = req.body._id;
  var title = req.body.title;
  Model.Category.update({
    _id: _id
  }, {
    $set: {
      title: title
    }
  }, function (
    err,
    doc
  ) {
    if (err) {
      console.log(err);
      return;
    } else {
      responseData.code = 200;
      responseData.message = "修改成功";
      responseData.data = doc;
      res.json(responseData);
    }
  });
});

// 查找所有文章
router.get("/admin_content", function (req, res, next) {
  var page = Number(req.query.page || 1);
  var limit = 4;
  var pages = 0;
  Model.Content.count().then(function (count) {
    pages = Math.ceil(count / limit); //总数据除以每页限制数据=页数
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    var skip = (page - 1) * limit;

    Model.Content.find({})
      .sort({
        _id: -1
      })
      .limit(limit)
      .skip(skip)
      .then(function (doc) {
        // console.log(doc);
        responseData.code = 200;
        responseData.message = "查找所有内容成功";
        responseData.data = doc;
        responseData.count = count;
        responseData.limit = limit;
        responseData.page = page;
        responseData.pages = pages;
        responseData.skip = skip;
        console.log(responseData);
        res.json(responseData);
      });
  });
});

// 文章添加页
router.get("/admin_category_add", function (req, res, next) {
  Model.Category.find({}, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      responseData.code = 200;
      responseData.message = "查询内容分类成功";
      responseData.data = doc;
      res.json(responseData);
    }
  });
});
// 文章添加操作页面
router.post("/admin_content_add", multipartyMiddleware, function (req, res, next) {
  console.log(req)
  var {
    category,
    content,
    songs,
    title
  } = req.body;
  songs = JSON.parse(songs);
  let D = Date.now();
  var songList = [];
  var coverList = {};
  var srcList = {};
  var contentCover = ""
  async function initFile() {
    let file = [];
    let allP = Object.keys(req.files).map((e) => {
      if (e.split('-')[0] == 'contentCover') {

      }
      return new Promise((res, rej) => {
        let ImgName = "";
        let saveImg = "";
        let fileName = ""
        let flag = 0;
        let name = e.split('-');
        if (name[0] == 'songCovers') {
          fileName = `-cover.${req.files[e].type.split("/")[1]}`
        } else if (name[0] == 'songFile') {
          fileName = '.mp3'
        } else {
          flag = -1;
        }
        ImgName = D + name[1] + flag + fileName;
        saveImg = path.join(__dirname, "../public/songs/" + ImgName); //api.js的上级的static下
        fs.readFile(req.files[e].path, (err, data) => {
          if (err) throw err;
          fs.writeFile(saveImg, data, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("写入成功！", saveImg);
              let cover = `${config.HOST}:${config.PORT}/songs/${ImgName}`;

              if (name[0] == 'songCovers') {
                coverList[name[1]] = cover;
              } else if (name[0] == 'songFile') {
                srcList[name[1]] = cover;
              } else {
                contentCover = cover;
              }
              res(saveImg);
            }
          });
        });
      })
    })
    await Promise.all(allP);
    return file
  }

  initFile().then(res => {
    songs.forEach((e, i) => {
      e.src = srcList[i]
      e.pic = coverList[i]
      songList.push(e);
    })
    console.log('songList===>', songList)
    Model.Song.insertMany(songList, (error, doc) => {
      let list = doc.map((e) => {
        return e._id;
      });
      let newContent = {
        title,
        content,
        category,

      }
      Model.Content.create()
      console.log('新建成功===>', doc)
      console.log('新建成功_id===>', list)
    })
  })








  // var title = req.body.articleName;
  // var category = req.body.articleCategory;
  // var content = req.body.articleContent;
  // var time = yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
  // var newContent = {
  //   title: title,
  //   category: category,
  //   content: content,
  //   time: time
  // };
  // Model.Content.create(newContent, function(err, doc) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   } else {
  //     responseData.code = 200;
  //     responseData.message = "查询内容分类成功";
  //     responseData.data = doc;
  //     res.json(responseData);
  //   }
  // });
});
// 文章删除
router.post("/admin_content_del", function (req, res, next) {
  var _id = req.body._id;
  Model.Content.remove({
    _id: _id
  }, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.send(doc);
    }
  });
});
// 跳转到文章修改页面
router.get("/admin_content_update", function (req, res, next) {
  var _id = req.query._id;
  Model.Content.findOne({
    _id: _id
  }, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      responseData.code = 200;
      responseData.message = "查询要修改内容成功";
      responseData.data = doc;
      res.json(responseData);
    }
  });
});

// 文章修改
router.post("/admin_content_update", function (req, res, next) {
  var articleTitle = req.body.articleTitle;
  var articleCategory = req.body.articleCategory;
  console.log("新的文章分类为" + articleCategory);
  var articleContent = req.body.articleContent;
  var articleId = req.body.articleId;
  var newContent = {
    title: articleTitle,
    category: articleCategory,
    content: articleContent
  };
  Model.Content.update({
    _id: articleId
  }, {
    $set: newContent
  }, function (
    err,
    doc
  ) {
    if (err) {
      console.log(err);
      return;
    } else {
      // console.log(doc);
      res.send(doc);
    }
  });
});

// 跳转到文章评论管理页面
router.get("/admin_content_comment", function (req, res, next) {
  var _id = req.query._id;
  Model.Content.findOne({
    _id: _id
  }, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      responseData.code = 200;
      responseData.message = "查询当前内容,所有的评论成功";
      responseData.data = doc;
      res.json(responseData);
    }
  });
});

// 删除当前文章的一个评论
router.post("/admin_content_comment", function (req, res, next) {
  var _id = req.body._id;
  var user = req.body.user;
  var comments = req.body.comments;
  var time = req.body.time;
  var delData = {
    user: user,
    comments: comments,
    time: time
  };
  console.log("传过来的数据:" + _id, user, comments, time);
  Model.Content.findOne({
    _id: _id
  }, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      doc.comment.remove(delData);
      doc.save();
      responseData.code = 200;
      responseData.message = "删除当前文章,一条评论成功";
      responseData.data = doc;
      res.json(responseData);
    }
  });
});

router.get("/admin_banner", function (req, res, next) {
  var page = Number(req.query.page || 1);
  // var test = JSON.stringify(req);
  console.log("req===>", req);
  var key = req.query.status ? {
    status: 1
  } : {};
  var limit = 4;
  var pages = 0;
  Model.Banner.count().then(function (count) {
    pages = Math.ceil(count / limit); //总数据除以每页限制数据=页数
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    var skip = (page - 1) * limit;

    Model.Banner.find(key)
      .limit(limit)
      .skip(skip)
      .then(function (doc) {
        console.log("doc==>", doc);
        responseData.code = 200;
        responseData.message = "获取轮播图成功";
        responseData.data = doc;
        responseData.count = count;
        responseData.limit = limit;
        responseData.page = page;
        responseData.pages = pages;
        responseData.skip = skip;
        console.log(responseData);
        res.json(responseData);
      });
  });
});
// 新增轮播
router.post("/admin_banner_add", multipartyMiddleware, function (req, res) {
  // var form = new multiparty.Form({ uploadDir: UPLOADPATH });
  // form.encoding = "utf-8";
  var {
    link,
    title
  } = req.body;
  console.log("新的轮播图名为:", req);
  // console.log("form", form);
  let D = Date.now();
  let ImgName = D + "." + req.files.file.type.split("/")[1];
  // console.log("saveImg===>", __dirname);
  let saveImg = path.join(__dirname, "../public/banner/" + ImgName); //api.js的上级的static下
  fs.readFile(req.files.file.path, (err, data) => {
    if (err) throw err;
    fs.writeFile(saveImg, data, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("写入成功！", saveImg);
        newBanner = {
          imgURl: `${config.HOST}:${config.PORT}/banner/${ImgName}`,
          link,
          title,
          time: yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss
        };
        Model.Banner.create(newBanner, function (doc) {
          responseData.code = 200;
          responseData.message = "新增轮播成功";
          responseData.data = doc;
          res.json(responseData);
        });
      }
    });
  });
});
// 轮播图删除
router.post("/admin_banner_del", function (req, res, next) {
  var {
    _id,
    fileName
  } = req.body;
  // console.log("path==>", req);
  fileName = fileName.split("banner/")[1];
  let filePath = path.join(__dirname, "../public/banner/" + fileName); //api.js的上级的static下
  Model.Banner.remove({
    _id: _id
  }, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      fs.unlink(filePath, () => {
        if (err) {
          console.log(err);
        } else {
          console.log("文件:" + fileName + "删除成功！");
        }
      });
      res.send(doc);
    }
  });
});
// 轮播图是否启用
router.post("/admin_banner_update", function (req, res, next) {
  var {
    _id,
    status,
    imgURl,
    link,
    title
  } = req.body;
  // console.log("path==>", req);
  var newBanner = {
    status,
    imgURl,
    link,
    title
  };
  Model.Banner.update({
    _id: _id
  }, {
    $set: newBanner
  }, function (err, doc) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.send(doc);
    }
  });
});

module.exports = router;
