import { get } from 'common/api'
import util from 'common/utils'
import shopitem from 'admin/model/shop_item.js'
// 数据
const data = {

  webinfo: {},
  site_pay_code: '',
  homeSwipeList: [],
  notice: [],
  search: { name: '', item_type: '' },
  homeads: [],

  lastpath: ''

}

data.getAll = function() {
  get('shop', 'getinfo')
  .then(response => {
    console.log(response)
    this.webinfo = response.webconfig
    this.site_pay_code = this.webinfo.site_pay_code || ''
    util.copyList(response.notice, this.notice)
    util.copyList(response.swipe, this.homeSwipeList)
    if (response.webhomeads != null && response.webhomeads.length >= 1) {
      util.copyList(response.webhomeads, this.homeads, item => {
        item.ads = item.ads || []
        item.ads.forEach(adsitem => {
          shopitem.initData(adsitem.iteminfo)
        })
      })
    }
  })
  .catch(err => {
    console.log('err', err);
  })
}


export default data;