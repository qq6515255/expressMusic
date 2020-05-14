<template lang="html">
  <div class="admin_article_update">
    <nav-bread>
      <span>内容修改</span>
    </nav-bread>
    <div class="form-group">
      <p>内容名称</p>
      <input type="text" v-model="articleTitle" placeholder="请输入分类名" />
    </div>
    <div class="form-group">
      <p>内容分类</p>
      <select v-model="articleCategory">
        <option v-for="item in categoryData">{{ item.title }}</option>
      </select>
    </div>
    <div class="form-group">
      <p>内容介绍</p>
      <textarea v-model="articleContent"></textarea>
    </div>

    <button type="button" @click="show = !show" class="fix">点击上传</button>

    <div class="list">
      <p class="tip">原有歌曲</p>
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
        <tr v-if="showList.length > 0" v-for="(item, index) in showList">
          <td>{{ index }}</td>
          <td><img :src="item.pic" style="width:150px;height:100px" /></td>
          <td>{{ item.title }}</td>
          <td>{{ item.artist }}</td>
          <td>{{ item.publishTime }}</td>
          <td>{{ item.lrc }}</td>
          <td>{{ item.src }}</td>
          <td>
            <button
              type="button"
              class="delButton"
              @click="delSong(item._id, index)"
            >
              删除
            </button>
          </td>
        </tr>
        <p class="tip" v-if="songList.length > 0">新增歌曲</p>
        <tr v-if="songList.length > 0" v-for="(item, index) in songList">
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
      <button type="button" @click="updateArticle(articleId)">修改</button>
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
          <el-button size="small" class="test" type="primary"
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
      articleData: "",
      articleTitle: "",
      articleCategory: "",
      articleContent: "",
      articleId: "",
      categoryData: "",
      editorOption: {},
      showList: [], //原有的
      deleSongs: [], //保存删除歌曲的_ID
      songFile: [],
      songCovers: [],
      songList: [], //新添加
      show: false,
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
    delSong(id, i) {
      this.showList.splice(i, 1);
      this.deleSongs.push(id);
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
      this.show = false;
      this.src = [];
      this.pic = [];
      this.$refs.cover.clearFiles();
      this.$refs.src.clearFiles();
      window.console.log("res=>", this.songCovers);
    },
    updateArticle(obj) {
      console.log(this.articleCategory);
      var that = this;
      let fd = new FormData();
      fd.append("title", this.articleTitle);
      fd.append("category", this.articleCategory);
      fd.append("content", this.articleContent);
      fd.append("articleId", obj);
      fd.append("deleSongs", this.deleSongs);
      if (this.songList.length > 0) {
        fd.append("songs", JSON.stringify(this.songList));
      }
      this.songFile.forEach((e, i) => {
        fd.append(`songFile-${i}`, this.songFile[i]);
      });
      this.songCovers.forEach((e, i) => {
        fd.append(`songCovers-${i}`, this.songCovers[i]);
      });

      this.$http.post("/admin/admin_content_update", fd).then(response => {
        console.log(response.data);
        this.$message({
          message: "修改成功，1秒后跳转",
          type: "info"
        });
        // setTimeout(function() {
        //   that.$router.push({ path: "/admin_article" });
        // }, 1000);
      });
    }
  },
  created() {
    this.$http
      .get("/admin/admin_content_update?_id=" + this.$route.query._id)
      .then(response => {
        console.log(response);
        this.articleTitle = response.data.data.title;
        this.articleCategory = response.data.data.category;
        this.articleContent = response.data.data.content;
        this.articleId = response.data.data._id;
        this.showList = response.data.data.songs;
      });
    this.$http.get("/index/index_category").then(response => {
      console.log(response.data);
      this.categoryData = response.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
h1 {
  margin: 20px 0;
  margin-left: 120px;
}
button {
  // margin-left: 120px;
  // margin-top: 70px;
}
.edit {
  margin: 0 40px;
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
.test {
  margin-top: 10px;
  margin-left: 20px;
}
.list {
  margin: 30px 0px;
}
.upload-demo {
  width: 70%;
}
.tip {
  font-size: 26px;
  text-align: center;
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
.articleContent {
  height: 250px;
}
</style>
