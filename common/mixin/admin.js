import util from 'common/utils'
import model from 'src/model'
import conf from 'src/config.js'
import global from 'src/global.js'
import { all, post } from 'common/api'
// template 的一些字段：
// dataList :列表数据
// fieldList: dataModel.fieldList, // 数据对应的字段列表
// getData 方法 获取该页面的datalist数据
export default {
  data() {
    return {
      totalsize: 0, // 总数量
      curpage: 1, // 当前第几页
      pagesize: 10, // 每页的数量
      search: {}, // 搜索数据
      pagestart: 0,
      pageend: 0,
      searchFieldList: [], // 搜索存的数据
      checkAll: false, // 选择所有
      authDic: model.user.authDic,
      global,
      showfieldList: [] // 要显示的字段
    }
  },
  watch: {
  },
  methods: {
    searchClick(nowsearch) {
      this.search = nowsearch
      this.getData()
    },
    del(item) {
      console.log('del', item)
      if (!item) {
        const checkarr = util.getCheckdItem(this.dataList);
        const data = { id: checkarr }
        this.sendDel(data, JSON.stringify(checkarr))
      } else {
        const data = { id: item.id }
        this.sendDel(data, item.name)
      }
    },
    sendDel(data, name) {
      this.$alert('是否确认删除' + name, '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: true,
        callback: action => {
          if (action !== 'confirm') {
            return;
          }
          post(this.serverModelName, 'del', data)
          .then(() => {
            this.getData();
            this.$message({ message: '删除成功', type: 'success', duration: 1000 })
          })
          .catch(error => {
            console.log('err', error)
          })
        }
      });
    },
    addResolve() {
      return false;
    },
    addShowBefore() {

    },
    // 增加
    add() {
      this.dialogtitle = '新增';
      util.resetData(this.fieldList, this.dialogdata, this.addResolve);
      this.addShowBefore();
      this.dialogShow = true;
    },
    editShowBefore() {

    },
    // 编辑
    edit(item) {
      this.dialogtitle = '编辑';
      Object.assign(this.dialogdata, item);
      this.editShowBefore(item);
      this.dialogShow = true;
    },
    sendAdd(changedata) {
      post(this.serverModelName, 'add', changedata)
        .then(() => {
          this.dialogShow = false;
          this.getData();
          this.$message({ message: '新增成功', type: 'success', duration: 1000 })
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    sendEdit(changedata) {
      console.log('edit', changedata);
      post(this.serverModelName, 'edit', changedata)
      .then(() => {
        this.dialogShow = false;
        this.getData();
        this.$message({ message: '修改成功', type: 'success', duration: 1000 })
      })
      .catch(err => {
        console.log('err', err);
      })
    },
    dialogClick(nowdata) {
      console.log('edit nowdata', nowdata);
      console.log('edit before', this.dialogdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      if (this.dialogtitle === '新增') {
        this.sendAdd(changedata)
      } else {
        changedata = util.getChange(changedata, olddata);
        changedata.id = olddata.id
        this.sendEdit(changedata)
      }
    },
    copyDataFilter(item) {
      this.$set(item, 'checked', false);
      this.$set(item, 'canshow', this.canshow());
      const datamodel = model[this.modelName]
      if (datamodel.initData) {
        datamodel.initData(item)
      }
    },
    getData(getall) {
      const order = util.getOrder(this.fieldList);
      const search = this.getSearch(this.searchFilter);
      let page = this.curpage;
      let pagesize = this.pagesize;
      if (getall === true) {
        page = null;
        pagesize = null;
      }
      all(this.serverModelName, page, pagesize, order, search).then(
      data => {
        util.copyList(data.list, this.dataList, this.copyDataFilter)
        this.totalsize = data.num;
      }
      ).catch(error => {
        console.log('error', error);
      });
    },
    geturl(path) {
      return conf.webBase + path;
    },
    switchValue(info, field) {
      if (info[field] === 0) {
        info[field] = 1;
      } else {
        info[field] = 0;
      }
    },
    // 判断此行是否显示
    isRowShow(rowNum) {
      if (this.getAllData === false) {
        return true;
      } else {
        return rowNum >= (this.curpage - 1) * this.pagesize && rowNum < this.curpage * this.pagesize;
      }
    },
    // 是否定义了这个变量
    isDef(value) {
      if (value === null || value === undefined) {
        return false;
      }
      return true;
    },

    handleSizeChange(newsize) {
      if (this.pagesize === newsize) {
        return;
      }
      this.pagesize = newsize;

      this.getData();
    },
    canshow(index) {
      this.pagestart = (this.curpage - 1) * this.pagesize;
      this.pageend = this.curpage * this.pagesize;
      if (this.dataList.length > this.pagesize) {
        if (index >= this.pagestart && index < this.pageend) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    handleCurrentChange(newpage) {
      if (this.curpage === newpage) {
        return;
      }
      console.log('newpage', newpage);
      this.curpage = newpage;
      this.getData();
    },
     // 排序
    sort(index) {
      util.ChangeOrder(this.showfieldList, index)
      if (this.getData) {
        this.getData();
      }
    },
    searchFilter(value, keyname) {
      return false;
    },
    getSearch(filterCB) {
      const searchdata = {};
      this.fieldList.forEach(item => {
        const keyname = item.name
        const value = this.search[keyname]
        if (this.isDef(value) && (value !== '')) {
          const tablekey = item.tablename || keyname;
          if (filterCB && filterCB(value, keyname) !== false) {
            // 没有回调
            searchdata[tablekey] = filterCB(value, keyname)
          } else {
            let tempvalue = value;
            if (item.type === 'time') {
              tempvalue = util.getTimeSearch(value)
            } else if (item.mulSelectList) {
              tempvalue = util.getmultiSearch(value)
            }
            if (item.search) {
              searchdata[tablekey] = [item.search, tempvalue]
            } else {
              searchdata[tablekey] = tempvalue
            }
          }
        }
      });
      console.log('searchdata', searchdata);
      return searchdata;
    },
    toggle(info) {
      const datamodel = model[this.modelName]
      if (info.open) {
        if (info.children && info.children.length > 0) {
          info.open = false;
          const index = datamodel.openMenus.findIndex(item => item === info.id);
          datamodel.openMenus.splice(index, 1);
          util.showAllChild(info, false);
        }
      } else {
        info.open = true;
        datamodel.openMenus.push(info.id);
        util.showAllChild(info, true);
      }
    },
    getSelectName(value, selectlist) { return util.getSelectName(value, selectlist) },
    formatDate(time) { return util.formatDate(time) },
    formatTime(time) { return util.formatTime(time) },
    exportCSV(selectList) {
      const search = this.getSearch();
      console.log('export', search, selectList);
      const exportNameList = [];
      const exportHeadList = [];
      selectList.forEach(item => {
        exportNameList.push(item.name);
        exportHeadList.push(item.title);
      })
      post(this.serverModelName, 'ExportCsv', { search, headlist: exportHeadList, namelist: exportNameList, filename: this.serverModelName })
        .then(() => {
          this.exportSelctShow = false
          this.$message({ message: '导出成功，请往导出任务列表中查看', type: 'success', duration: 1000 })
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  }
};