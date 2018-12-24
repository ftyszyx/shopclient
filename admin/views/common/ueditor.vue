<template>
<div :id="id">
</div>
       
</template>

<script>
import config from 'src/config.js'
export default{
  name: 'ueditor',
  data() {
    return {
      // content: ''
      instance: null
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: false
    }
  },
  methods: {
    sure() {
      this.$emit('sure', this.checkid);
    }
  },
  beforeDestroy() {
    // 组件销毁的时候，要销毁 UEditor 实例
    if (this.instance !== null && this.instance.destroy) {
      this.instance.destroy();
    }
  },
  mounted() {
    const vm = this;
    vm.instance = window.UE.getEditor(vm.id, {
      autoHeightEnabled: false,
      catchRemoteImageEnable: false,
      initialFrameHeight: 400,
      serverUrl: config.baseURL + 'upload',
      lang: 'zh-cn',
      toolbars: [[
        'fullscreen', 'source', '|', 'undo', 'redo', '|',
        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
        'directionalityltr', 'directionalityrtl', 'indent', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
        'insertimage', 'emotion', 'insertvideo', 'attachment', 'insertcode', 'pagebreak', 'template', 'background', '|',
        'horizontal', 'date', 'time', 'spechars', '|',
        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
        'print', 'preview', 'searchreplace', 'drafts', 'help'
      ]]
    });
    // 对编辑器的操作最好在编辑器ready之后再做
    vm.instance.ready(() => {
    // 设置编辑器的内容
      console.log('ready')
      if (vm.text) {
        vm.instance.setContent(vm.text);
      }
      // const html = vm.instance.getContent();
      vm.instance.execCommand('serverparam', editor => ({
        token: window.localStorage.getItem('token') || '',
        uid: window.localStorage.getItem('uid') || ''
      }))
      vm.instance.addListener('contentChange', () => {
        const html = vm.instance.getContent();
        // const txt = vm.instance.getContentTxt();
        // console.log('html', html, txt)
        vm.$emit('change', html);
      })
    });
  },
  created() {
  }
}
</script>

<style scoped>
</style>
