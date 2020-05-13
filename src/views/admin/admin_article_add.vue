<template lang="html">
  <div class="admin_article_add">
    <nav-bread>
      <span>内容增加</span>
    </nav-bread>
    <div class="form-group">
      <p>内容名称</p>
      <input type="text" v-model="articleName" placeholder="请输入内容名称" />
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
      <button type="button" @click="show=!show" class="fix">点击上传</button>
      <!-- <el-input-number
        v-model="num"
        controls-position="right"
        :min="0"
        :max="10"
      ></el-input-number> -->
    </div>
    <div class="list">
            <table>
        <tr>
          <th>序号</th>
          <th>歌曲封面</th>
          <th>歌曲名称</th>
          <th>歌手名称</th>
          <th>出版时间</th>
          <th>歌词文件</th>
          <th>歌曲文件</th>
          <th>操作</th>
        </tr>
        <!-- songFile -->
        <tr v-for="(item, index) in songList">
          <td>{{ index }}</td>
          <td>{{ songCovers[index].name }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.artist }}</td>
          <td>{{ item.publishTime }}</td>
          <td>{{ item.lrc }}</td>
          <td>{{ songFile[index].name }}</td>
          <td @click="del(index)">
            <button type="button" class="delButton">删除</button>
          </td>
        </tr>
      </table>
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
    <div class="add-box" v-if="show">
      <h2>歌曲上传</h2>
      <div class="form-group in">
        <p>歌曲名称</p>
        <input type="text" v-model="title" placeholder="请输入歌曲名称" />
      </div>
      <div class="form-group in">
        <p>歌手名称</p>
        <input type="text" v-model="artist" placeholder="请输入歌手名称" />
      </div>
      <div class="form-group in">
        <p>出版时间</p>
        <input type="text" v-model="publishTime" placeholder="请输入出版时间" />
      </div>
      <div class="form-group in">
        <p>歌词文件</p>
        <input type="text" v-model="lrc" placeholder="请输入歌曲文件地址" />
      </div>

      <div class="form-group con">
        <p class="fix">封面上传</p>
        <el-upload
          accept=".png,.jpg"
          list-type="picture"
          class="upload-demo"
          action="1"
          :limit="1"
          ref="cover"
          :http-request="upload"
          :on-remove="remove"

        >
          <el-button size="small" class="test" type="primary"
            >点击上传</el-button
          >
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
      <div class="form-group con">
        <p class="fix">歌曲上传</p>
        <el-upload
          class="upload-demo"
          action="1"
          :limit="1"
          ref="src"
          :http-request="mp3Upload"
          :on-remove="mp3Remove"
        >
          <el-button size="small"  class="test" type="primary"
            >点击上传</el-button
          >
        </el-upload>
      </div>
      <button type="button" @click="commitSong">提交</button>
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
      editorOption: {},
      songList: [],
      show: false,
      songFile: [],
      songCovers: [],
      //添加表单的内容
      title: "",
      artist: "",
      publishTime: "",
      lrc: "",
      pic: [],
      src: []
    };
  },
  components: {
    navBread
  },
  methods: {
    addArticle() {
      var that = this;
      let fd = new FormData();
      fd.append("title", this.articleName);
      fd.append("category", this.articleCategory);
      fd.append("content", this.articleContent);
      fd.append("songs", JSON.stringify(this.songList));
      this.songFile.forEach((e, i) => {
        fd.append(`songFile-${i}`, this.songFile[i]);
      });
      this.songCovers.forEach((e, i) => {
        fd.append(`songCovers-${i}`, this.songCovers[i]);
      });
      this.$http.post("/admin/admin_content_add", fd).then(response => {
        console.log(response.data);
        this.$message({
          message: "增加成功，1秒后跳转",
          type: "success"
        });
        // setTimeout(function() {
        //   that.$router.push({ path: "/admin_article" });
        // }, 1000);
      });
    },
    remove(file, fileList) {
      this.pic = [];
    },
    mp3Remove(file, fileList) {
      this.src = [];
    },
    upload(item) {
      console.log(item);
      this.pic.push(item.file);
    },
    mp3Upload(item) {
      console.log(item);
      this.src.push(item.file);
    },
    del(index) {
      this.songCovers.splice(index, 1);
      this.songFile.splice(index, 1);
      this.songList.splice(index, 1);
    },
    commitSong() {
      let song = {
        title: this.title,
        artist: this.artist,
        publishTime: this.publishTime,
        lrc: this.lrc
      };
      console.log("asd", song);
      this.songFile = this.songFile.concat(this.src);
      this.songCovers = this.songCovers.concat(this.pic);
      this.songList.push(song);
      this.title = "";
      this.artist = "";
      this.publishTime = "";
      this.lrc = "";
      // this.remove();
      // this.mp3Remove();
      this.show = false;
      this.src = [];
      this.pic = [];
      this.$refs.cover.clearFiles();
      this.$refs.src.clearFiles();
      window.console.log("res=>", this.songCovers);
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
  margin-top: 0;
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
    flex: 0;
  }
}
.add-box {
  width: 600px;
  height: 90vh;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  position: fixed;
  top: 5vh;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  h2 {
    text-align: center;
    color: white;
    font-size: 30px;
  }
}
.in {
  color: white;
}
// .fix {
//   flex: 0;
//   width: unset;
//   display: inline-block;
// }
.con {
  flex-direction: row;
  color: white;
}
.test {
  margin-top: 10px;
  margin-left: 20px;
}
.form-group {
  p {
    width: unset;
    display: inline-block;
    flex: unset;
  }
}
.el-upload-list__item-name {
  color: white !important;
}
.list {
  margin: 30px 0px;
}
</style>
