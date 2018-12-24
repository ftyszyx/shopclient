<template>
    <div>
      <sell operWidth="300px" showSyncShop showOper showChangeShipnum showSyncLogistics showRefrshLogistics showCheckBox   showEdit :showTableFiled="TableFiled" :searchConditon="SearchCondition" :showSearchFiled="SearchFiled" ></sell>
    </div>
</template>

<script>
import Sell from 'views/erp/sell/sell'
import global from 'src/global'
export default{
  data() {
    return {
      SearchFiled: ['id', 'shop_id', 'shop_sync_flag', 'shop_order', 'item_name', 'store_id', 'item_short_name','supply_source',
        'customer_account', 'assign_order', 'customer_name', 'user_phone', 'logistics', 'track_man', 'pay_time', 'order_time'],
      TableFiled: ['id', 'item_name', 'logistics', 'shop_sync_flag','supply_source',
        'num', 'status', 'shop_name', 'customer_account', 'unit_price', 'pay_money',
        'send_user_name', 'send_user_phone',
        'customer_name', 'track_man', 'shop_order',
        'user_info', 'sell_vip_type'],
      SearchCondition: { status: global.sellStatus_assign, shop_sync_flag: 0, shop_id: 6 }
    }
  },
  components: {
    Sell
  },

  methods: {
  }
}
</script>

<style scoped>


</style>
