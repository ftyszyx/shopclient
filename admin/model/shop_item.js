import global from 'src/global'
// 数据
const data = {
  list: []
}

data.fieldList = [
      { name: 'id', title: 'id' },
      { name: 'name', title: '名称', changeable: true, search: 'LIKE', sort: 0, rules: [{ required: true, message: '请输入名称' }], tablename: 'item.name' },
      { name: 'order_id', title: '排序', changeable: true, sort: 1, width: '70px', rules: [{ required: true, message: '排序id不能空' }], tablename: 'item.order_id', type: 'number' },
      { name: 'is_onsale', title: '是否上线', changeable: true, width: '70px', selectList: global.onsaleStatus },
      { name: 'code', title: '编码', changeable: true, rules: [{ required: true, message: '编码不能为空' }], tablename: 'item.code' },
      { name: 'price', title: '价格', width: '70px', changeable: true, rules: [{ required: true, message: '价格不能为空' }], tablename: 'item.price' },
      { name: 'store_num', title: '库存', width: '70px', changeable: true },
      { name: 'sell_num', title: '销量', sort: 0, width: '70px' },
      { name: 'item_type', title: '商品类型', changeable: true, cascaderList: [], rules: [{ required: true, message: '类型不能为空' }] },
      { name: 'item_type_name', title: '商品类型' },
      { name: 'brand', title: '商品品牌', changeable: true, selectList: [], rules: [{ required: true, message: '品牌不能为空' }] },
      { name: 'brand_name', title: '商品品牌' },
      { name: 'pics', title: '商品介绍图片', changeable: true, type: 'pics', tab: 'pics', info: '推荐图片大小550*250' },
      { name: 'icon', title: '商品图标', changeable: true, type: 'pic', info: '推荐图片大小250*250', width: '100px' },
      { name: 'spec', title: '商品规格', changeable: true, tab: 'spec', deepcopy: 'true' },


      { name: 'desc', title: '详细信息', changeable: true, type: 'post', tab: 'desc' },

      { name: 'item_unit', title: '单位', changeable: true, rules: [{ required: true, message: '单位不能为空' }] },
      { name: 'item_shelf_life', title: '保质期', changeable: true },

      { name: 'basenum', title: '购买最小单位', changeable: true, type: 'number', tablename: 'item.basenum' },
      { name: 'iteminfo', title: '商品信息' },
      { name: 'is_sync_shipnum', title: '是否同步物流信息', changeable: true, type: 'bool', tablename: 'item.is_sync_shipnum' },
      { name: 'idnum_need', title: '是否要身份证', changeable: true, selectList: global.ItemNeedIdNum },
      { name: 'supply_source', title: '发货方式', width: '70px', changeable: true, selectList: global.supply_source_type, tablename: 'item.supply_source' },
      { name: 'no_service', title: '服务状态', changeable: true, tablename: 'item.no_service', selectList: global.ServiceStatus, rules: [{ required: true, message: '服务状态不能为空' }] },
      { name: 'tag', title: '商品标签', changeable: true, width: '100px', mulSelectList: [] },
      { name: 'min_num', title: '最小数量', changeable: true, type: 'number' },
      { name: 'group_price', title: '分组价格', changeable: true, deepcopy: 'true' }

]


data.initData = function(item) {
  // item.price = parseFloat(item.price)
  item.is_onsale = parseInt(item.is_onsale)
  item.order_id = parseInt(item.order_id)
  item.spec = JSON.parse(item.spec)
  item.basenum = parseInt(item.basenum)
  item.min_num = parseInt(item.min_num)
  item.sell_num = parseInt(item.sell_num)
  item.is_sync_shipnum = parseInt(item.is_sync_shipnum)
  if (!item.group_price) { item.group_price = [] } else {
    item.group_price = JSON.parse(item.group_price) || []
  }

  if (!item.tag) { item.tag = [] } else {
    item.tag = JSON.parse(item.tag) || []
  }

  if (!item.pics) { item.pics = [] } else {
    item.pics = JSON.parse(item.pics) || []
  }
  if (!item.spec) { item.spec = { specList: [], detailList: [] } }
}


// group_price=[{groupid:2,price:12.33}]
// 规格信息结构
// const spec =
//   { specList: [{
//     name: '颜色',
//     id:1
//     list: [
//       {
//          id:2
//         name: '黄色',
//       }
//     ]
//   }
//   ],
//     detailList: [
//       {
//         namearr: [{ specid: 2, tagid: 3 }],
//         price: '122',
//        group_price=[{groupid:2,price:12.33}]
//         store_num: '12',
//         code: '12354',
//         pic: ''
//       }
//     ]
//   };
export default data;
