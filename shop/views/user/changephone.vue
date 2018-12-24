<template>
  <phone-check root="/userset" title="修改手机号" suretext="确认" v-on:submit="handlechange"></phone-check>
</template>

<script>
import { post } from 'common/api'
import mymix from 'src/mixin'
import PhoneCheck from 'views/user/phonecheck'
export default {
  name: 'changephone',
  mixins: [mymix],
  data() {
    return {
    }
  },
  components: {
    PhoneCheck
  },
  methods: {
    handlechange(phone, code) {
      post('user', 'UpdatePhone', { phone, code })
      .then(() => {
        this.$toast('修改成功')
        this.user.phone = phone
        this.$router.push({ path: this.app.lastpath });
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  created() {
  }

}
</script>

<style scoped>
</style>
