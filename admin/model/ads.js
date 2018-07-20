import global from 'src/global'
// 数据
const data = {
  list: []
}


data.fieldList = [
    { name: 'id', title: 'id', sort: 0 },
    { name: 'name', title: '名称', changeable: true, sort: 0, rules: [{ required: true, message: '请输入名称' }] },
    { name: 'ads_pos', title: '广告位', changeable: true, selectList: [] },
    { name: 'ads_pos_name', title: '广告位' },

    { name: 'link', title: '链接', changeable: true },
    { name: 'order_id', title: '排序id', type: 'number' },
    { name: 'title', title: '标题', changeable: true },
    { name: 'item_name', title: '展示商品', changeable: true },
    { name: 'item_id', title: '展示商品', changeable: true },
    { name: 'post_id', title: '展示文章', changeable: true },
    { name: 'post_title', title: '展示文章', changeable: true },
    { name: 'is_del', title: '是否废弃', selectList: global.deleteStatus },
    { name: 'pic', title: '图片', changeable: true, type: 'pic', width: '150px', info: '推荐图片大小250*250' }

]


data.initData = function(item) {
  item.order_id = parseInt(item.order_id)
}

export default data;
