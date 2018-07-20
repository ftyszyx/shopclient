// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id' },
  { name: 'itemid', title: '商品id' },
  { name: 'item_name', title: '商品名', search: 'LIKE', tablename: 'item.name' },
  { name: 'item_code', title: '商品代码', search: 'LIKE', tablename: 'item.code', width: '100px' },
  { name: 'item_barcode', title: '商品条码', search: 'LIKE', tablename: 'item.barcode', width: '120px' },
  { name: 'item_type', title: '商品类别', tablename: 'item.type' },
  { name: 'item_type_id', title: '商品类别id', selectList: [], tablename: 'item.type' },
  { name: 'store_id', title: '仓库', selectList: [] },
  { name: 'store_name', title: '仓库名', search: 'LIKE', tablename: 'store.name' },
  { name: 'in_store', title: '在库数量', width: '80px' },
  { name: 'on_way', title: '在途数', width: '60px' },
  { name: 'in_sale', title: '已售数量', width: '80px' }
]
data.initData = function(item) {
}
export default data;