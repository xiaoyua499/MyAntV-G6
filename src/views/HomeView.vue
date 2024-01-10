<template>
  <div class="home" style="width: 100%; height: 100%;">
    <CustomTreeLayout/>
  </div>
</template>

<script>
// @ is an alias to /src
import AboutView from '@/views/AboutView.vue'
import CustomNode from '@/components/CustomNode/CustomNode.vue'//自定义节点
import AvoidOverlap from '@/components/collisionDetection/AvoidOverlap.vue';//碰撞dome
import CustomTreeLayout from '@/components/CustomTreeLayout/CustomTreeLayout.vue';//自定义树形布局dome
import subgraphLayout from '@/components/subgraphLayout.vue';//子图布局dome
export default {
  name: 'HomeView',
  components: {
    CustomNode,
    AvoidOverlap,
    AboutView,
    CustomTreeLayout,
    subgraphLayout
  }
}
</script>
