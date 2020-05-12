<template lang="html">
  <div class="admin_article_add">
    <nav-bread>
      <span>添加轮播图</span>
    </nav-bread>
    <div class="form-group">
      <p>轮播图标题</p>
      <input type="text" v-model="bannerTitle" placeholder="请输入轮播图标题" />
    </div>
    <div class="form-group">
      <p>轮播图链接</p>
      <input
        type="text"
        v-model="bannerLink"
        placeholder="请输入轮播图跳转链接"
      />
    </div>
    <div class="form-group con">
      <p class="fix">轮播图上传</p>
      <el-upload
        list-type="picture"
        class="upload-demo"
        action="1"
        :limit="1"
        ref="newupload"
        :http-request="upload"
        :file-list="showList"
        :on-success="success"
        :on-remove="remove"
      >
        <el-button size="small" class="test" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </div>
    <div class="edit">
      <button type="button" @click="addArticle">添加</button>
    </div>
  </div>
</template>

<script>
import navBread from "../../components/navBread";
export default {
  data() {
    return {
      showList: [],
      fileList: [],
      bannerTitle: "",
      bannerLink: ""
    };
  },
  components: {
    navBread
  },
  methods: {
    addArticle() {
      var that = this;
      let fd = new FormData();

      fd.append("file", this.fileList[0]);
      fd.append("link", this.bannerLink); //其他参数
      if (this.bannerTitle != "") {
        fd.append("title", this.bannerTitle); //其他参数
      }

      this.$http.post("/admin/admin_banner_add", fd).then(response => {
        console.log(response.data);
        this.$message({
          message: "增加成功，1秒后跳转",
          type: "success"
        });
        setTimeout(function() {
          that.$router.push({ path: "/admin_banner" });
        }, 1000);
      });
    },
    remove(file, fileList) {
      this.fileList = [];
    },
    handlePreview(file) {
      console.log(file);
    },
    upload(item) {
      console.log(item);
      this.fileList.push(item.file);
    },
    success(response, file, fileList) {
      window.console.log("file==>", file);
      window.console.log("fileList==>", fileList);
      window.console.log("response==>", response);
      //   this.fileLists = [];
      //   this.fileLists = [file];
      //   this.form.logo = file.response.result;
    }
    // beforeUpload(file) {
    //   window.console.log("file==>", file);
    // }
  },
  created() {}
};
</script>

<style lang="less" scoped>
h1 {
  margin-left: 120px;
}
button {
  margin-top: 70px;
}
.edit {
  margin: 0 100px;
}
.articleContent {
  height: 250px;
}
.con {
  flex-direction: column;
}
.upload-demo {
  width: 50%;
  margin-left: 100px;
}
.el-upload {
  display: flex;
  align-items: center;
  justify-content: center;
}
.test {
  margin: 20px 0px !important;
}
.fix {
  flex: 0;
}
</style>
