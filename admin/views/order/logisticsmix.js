import util from 'common/utils'
export default{
  data() {
    return {
      taskField: [{ name: 'use_time', title: '耗时(单位h)', changeable: true, type: 'number' }, { name: 'info', title: '描述', changeable: true }],
      addtaskPanel: false,
      addtaskpanelTitle: '新增',
      tasklist: [],
      taskeditIndex: 0,
      addtaskData: {}
    }
  },

  methods: {
    addOneTask(datalist) {
      this.tasklist = datalist
      this.addtaskpanelTitle = '新增'
      util.resetData(this.taskField, this.addtaskData);
      this.addtaskPanel = true;
    },
    delOneTask(index, datalist) {
      datalist.splice(index, 1)
    },
    editOneTask(index, datalist) {
      this.addtaskpanelTitle = '编辑';
      this.taskeditIndex = index;
      this.tasklist = datalist
      Object.assign(this.addtaskData, datalist[index]);
      this.addtaskPanel = true;
    },
    addTaskSure(nowdata) {
      const changedata = Object.assign({}, nowdata);
      if (changedata.time) {
        changedata.time = changedata.time.valueOf() / 1000
      }
      if (this.addtaskpanelTitle === '新增') {
        this.tasklist.push(changedata)
      } else {
        this.tasklist.splice(this.taskeditIndex, 1, changedata)
      }
      this.addtaskPanel = false;
    }

  }


};