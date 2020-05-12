<template lang="html">
  <div class="admin_article_add">
    <nav-bread>
      <span>内容增加</span>
    </nav-bread>
    <div class="form-group">
      <p>内容名称</p>
      <input type="text" v-model="articleName" placeholder="请输入文章名称" />
    </div>
    <div class="form-group">
      <p>内容分类</p>
      <select v-model="articleCategory">
        <option v-for="item in categoryData">{{ item.title }}</option>
      </select>
    </div>
    <div class="form-group">
      <p>内容简介</p>
      <textarea v-model="articleContent"></textarea>
    </div>
    <div class="upload-mp3">
      <p class="title">上传歌曲</p>
      <button type="button" class="fix">点击上传</button>
      <!-- <el-input-number
        v-model="num"
        controls-position="right"
        :min="0"
        :max="10"
      ></el-input-number> -->
    </div>
    <div class="edit">
      <!-- <quill-editor
        class="articleContent"
        v-model="articleContent"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
      >
      </quill-editor> -->
      <button type="button" @click="addArticle">添加</button>
    </div>
  </div>
</template>

<script>
import navBread from "../../components/navBread";
export default {
  data() {
    return {
      num: 1,
      articleName: "",
      articleCategory: "",
      articleContent: "",
      categoryData: "",
      editorOption: {}
    };
  },
  components: {
    navBread
  },
  methods: {
    addArticle() {
      var that = this;
      this.$http
        .post("/admin/admin_content_add", {
          articleName: this.articleName,
          articleCategory: this.articleCategory,
          articleContent: this.articleContent
        })
        .then(response => {
          console.log(response.data);
          this.$message({
            message: "增加成功，1秒后跳转",
            type: "success"
          });
          setTimeout(function() {
            that.$router.push({ path: "/admin_article" });
          }, 1000);
        });
    },
    onEditorBlur(editor) {},
    onEditorFocus(editor) {},
    onEditorReady(editor) {},
    onEditorChange({ editor, html, text }) {
      this.content = html;
    }
  },
  created() {
    this.$http.get("/index/index_category").then(response => {
      console.log(response.data);
      this.categoryData = response.data.data;
      console.log(this.categoryData);
    });
  }
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
  margin: 0 40px;
}
.articleContent {
  height: 250px;
}
.upload-mp3 {
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  .title {
    line-height: 40px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .fix {
    margin: 0;
  }
}
</style>
