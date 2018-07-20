<template>
    <div class="search-box">
            <template v-for="field in searchFieldList">
                <div :key="field.name" class="search-itembox" >
                    <span class="form-label">{{field.title}}</span>
                    <common-search :field="field" :value="search[field.name]"  v-on:change="changeSearch(field.name,arguments[0])"></common-search>
                </div>
            </template>
            <button @click="resetSearch()" class="button-common">清除条件</button>
            <button @click="searchClick()" class="button-common">搜索</button>
        </div>
       
</template>

<script>
import CommonSearch from './common_search'
export default{
  name: 'CommonSearchBox',
  data() {
    return {
      cursearch: {}
    }
  },
  watch: {
    search() {
      Object.assign(this.cursearch, this.search)
    }
  },
  props: {
    search: {
      type: Object
    },
    searchFieldList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    CommonSearch
  },
  methods: {
    resetSearch(name) {
      if (name) {
        this.$set(this.cursearch, name, undefined)
      } else {
        this.searchFieldList.forEach(item => {
          if (item.mulSelectList) {
            this.$set(this.cursearch, item.name, [])
          } else {
            this.$set(this.cursearch, item.name, undefined)
          }
        })
      }
    },
    changeSearch(name, value) {
      this.$set(this.cursearch, name, value)
    },
    searchClick() {
      this.$emit('search', this.cursearch);
    }
  },
  created() {
    this.resetSearch()
    Object.assign(this.cursearch, this.search)
  }
}
</script>

<style scoped>
</style>
