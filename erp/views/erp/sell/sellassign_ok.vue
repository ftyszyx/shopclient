<template>
    <div>
      <sell showSyncShop showOper showChangeShipnum showCheckBox   showEdit  :searchConditon="SearchCondition" :showSearchFiled="SearchFiled" ></sell>
    </div>
</template>

<script>
import Sell from 'views/erp/sell/sell'
import global from 'src/global'
export default{
  data() {
    return {
      SearchFiled: ['shop_order', 'item_name', 'store_id', 'item_short_name',
        'customer_account', 'shop_id', 'assign_order', 'customer_name', 'user_phone', 'logistics', 'track_man', 'pay_time', 'order_time'],
      TableFiled: ['id', 'item_name',
          'num', 'status', 'shop_name', 'customer_account', 'unit_price', 'pay_money',
          'send_user_name', 'send_user_phone',
          'customer_name', 'track_man', 'shop_order',
          'user_info','sell_vip_type'],
      SearchCondition: { status: global.sellStatus_assign }
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
