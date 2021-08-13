<template>
  <div>
    <y-header />
    <!-- 子路由的出口-->
    <router-view />
  </div>
</template>

<script>
import YHeader from '../components/header'
export default {
  components: {
    YHeader
  }
}
</script>
<style lang="scss" scoped>

</style>
