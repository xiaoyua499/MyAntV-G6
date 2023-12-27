<template>
  <div class="home">
    <CustomNode/>
  </div>
</template>

<script>
// @ is an alias to /src
import AboutView from '@/views/AboutView.vue'
import CustomNode from '@/components/CustomNode.vue'//自定义节点
import AvoidOverlap from '@/components/AvoidOverlap.vue';//碰撞dome
export default {
  name: 'HomeView',
  components: {
    CustomNode,
    AvoidOverlap,
    AboutView
  }
}
</script>
