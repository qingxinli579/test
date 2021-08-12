<template>
  <div style="width:50%" id="wangeditor">
    <el-button size="small" @click="changeFun()"
      >切换至{{ !textareaShow ? "html源码" : "富文本" }}</el-button
    >
    <div v-show="!textareaShow" ref="editorElem" @keydown="keyFUN"></div>
    <el-input
      type="textarea"
      v-show="textareaShow"
      :rows="16"
      @change="editorContentKeydown()"
      placeholder="请输入内容"
      v-model="editorContent"
    >
    </el-input>
  </div>
</template>
<script>
import E from "wangeditor";
import emojiJSON from "@/components/emoji.json";
export default {
  name: "Editor",
  data() {
    return {
      editor: null,
      editorContent: "",
      emojiList: emojiJSON,
      popData: "",
      textareaShow: false
    };
  },
  // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
  //   props: ['catchData'], // 接收父组件的方法
  props: ["pop"], // 接收父组件的方法
  methods: {
    changeFun() {
      this.textareaShow = !this.textareaShow;
    },
    editorContentKeydown() {
      this.editor.txt.html(this.editorContent);
    },
    keyFUN(e) {
      // console.log(e)
      // if(e.keyCode == 13 && !e.shiftKey){
      //   e.keyCode = 49
      // }
      if (e.keyCode == 13) {
        // e.returnValue = false;
        // e.keyCode = 49
      }
    },
    filterFUN(url, alt) {
      //需要处理的   条件   替换的
      this.emojiList.forEach(element => {
        let url =
          '<img src="' +
          element.src +
          '" alt="' +
          element.alt +
          '" data-w-e="1">';
        let url2 = '<img src="' + element.src + '" data-w-e="1">';
        if (this.editorContent.indexOf(url) !== -1) {
          this.editorContent = this.editorContent.replace(url, element.alt);
          this.filterFUN();
        }
        if (this.editorContent.indexOf(url2) !== -1) {
          this.editorContent = this.editorContent.replace(url2, element.alt);
          this.filterFUN();
        }
      });
    },
    filterFUNX() {
      this.emojiList.forEach(element => {
        let url = '<img src="' + element.src + '" data-w-e="1">';
        if (this.popData.indexOf(element.alt) !== -1) {
          this.popData = this.popData.replace(element.alt, url);
          this.filterFUNX();
        }
      });
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editorElem);
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
      //   this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
      // 处理内容里的标签内容
      this.editorContent = this.editorContent.replace(/<\/p><p>/gi, "<br>");
      this.editorContent = this.editorContent.replace(/<\/p><a/gi, "<br>");
      this.editorContent = this.editorContent.replace(/<div><a/gi, "<br><a");
      this.editorContent = this.editorContent.replace(/<p>/gi, "");
      this.editorContent = this.editorContent.replace(/<\/p>/gi, "");

      // this.editorContent=this.editorContent.replace(/<br>/ig,"<br>");

      this.editorContent = this.editorContent.replace(/<div>/gi, "");
      this.editorContent = this.editorContent.replace(/<\/div>/gi, "");
      // this.editorContent=this.editorContent.replace(/<span>/ig,"");
      // this.editorContent=this.editorContent.replace(/<\/span>/ig,"");
      this.editorContent = this.editorContent.replace(/target="_blank"/gi, "");
      this.editorContent = this.editorContent.replace(/&amp;/gi, "&");
      this.editorContent = this.editorContent.replace(/&gt;/gi, ">");
      this.editorContent = this.editorContent.replace(/&lt;/gi, "<");
      this.editorContent = this.editorContent.replace(
        /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/gi,
        ""
      );

      this.filterFUN();
      // this.emojiList.forEach(element => {
      //     let url = '<img src="'+element.src+'" alt="'+element.alt+'" data-w-e="1">'

      //     this.editorContent=this.editorContent.replace(url,element.alt);
      //     // if (result.indexOf(url) !== -1) {
      //     //     result=result.replace(url,element.alt);
      //     // }
      // });
      console.warn(this.editorContent);
      this.$emit("catchData", this.editorContent);
    };

    this.editor.customConfig.menus = [
      // 菜单配置
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      //   'backColor', // 背景颜色
      "link", // 插入链接
      //   'list', // 列表
      "justify", // 对齐方式
      //   'quote', // 引用
      "emoticon", // 表情
      //   'image', // 插入图片
      //   'table', // 表格
      "code", // 插入代码
      "undo" // 撤销
      //   'redo' // 重复
    ];
    this.editor.customConfig.emotions = [
      {
        // tab 的标题
        title: "表情",
        // type -> 'emoji' / 'image'
        type: "image",
        // content -> 数组
        // content: [':1:',':2:']
        content: this.emojiList
      }
    ];
    this.editor.create(); // 创建富文本实例
    console.log(this.pop);
    if (this.pop) {
      this.popData = this.pop;
      this.filterFUNX();
      this.editor.txt.html(this.popData);
    }
  }
};
</script>
<style lang="scss">
#wangeditor {
  .w-e-text-container {
    .w-e-text {
      a {
        color: blue;
        text-decoration: underline;
      }
    }
  }
}
</style>
