import global from 'src/global'
// 数据
const data = {
  list: []
}

data.fieldList = [
      { name: 'id', title: 'id' },
      { name: 'name', title: '名称', changeable: true, search: 'LIKE', sort: 0, rules: [{ required: true, message: '请输入名称' }], tablename: 'item.name' },
      { name: 'order_id', title: '排序id', changeable: true, sort: 2, tablename: 'item.order_id', type: 'number' },
      { name: 'is_onsale', title: '是否上线', changeable: true, selectList: global.onsaleStatus },
      { name: 'code', title: '编码', changeable: true, rules: [{ required: true, message: '编码不能为空' }], tablename: 'item.code' },
      { name: 'price', title: '价格', width: 60, changeable: true, rules: [{ required: true, message: '价格不能为空' }], tablename: 'item.price' },
      { name: 'store_num', title: '库存数', width: 60, changeable: true },
      { name: 'sell_num', title: '销量' },
      { name: 'item_type', title: '商品类型', changeable: true, cascaderList: [], rules: [{ required: true, message: '类型不能为空' }] },
      { name: 'item_type_name', title: '商品类型' },
      { name: 'brand', title: '商品品牌', changeable: true, selectList: [], rules: [{ required: true, message: '品牌不能为空' }] },
      { name: 'brand_name', title: '商品品牌' },
      { name: 'pics', title: '商品介绍图片', changeable: true, type: 'pics', tab: 'pics', info: '推荐图片大小550*250' },
      { name: 'icon', title: '商品图标', changeable: true, type: 'pic', info: '推荐图片大小250*250', width: '150px' },
      { name: 'spec', title: '商品规格', changeable: true, tab: 'spec', deepcopy: 'true' },
      { name: 'tag', title: '商品标签', changeable: true, mulSelectList: [] },
      { name: 'desc', title: '详细信息', changeable: true, type: 'post', tab: 'desc' },


      { name: 'iteminfo', title: '商品信息' }
]


data.initData = function(item) {
  item.price = parseFloat(item.price)
  item.is_onsale = parseInt(item.is_onsale)
  item.order_id = parseInt(item.order_id)
  item.pics = JSON.parse(item.pics)
  item.tag = JSON.parse(item.tag)
  item.spec = JSON.parse(item.spec)
  if (!item.tag) { item.tag = [] }
  if (!item.pics) { item.pics = [] }
  if (!item.spec) { item.spec = { specList: [], detailList: [] } }
}


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
//         store_num: '12',
//         code: '12354',
//         pic: ''
//       }
//     ]
//   };
export default data;
