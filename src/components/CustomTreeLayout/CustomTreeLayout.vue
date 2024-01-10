<template>
  <div>
    <div ref="container" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { renderLayout } from "@/components/CustomTreeLayout/customTreeLayout.js"
import { renderData, graphHighlight, clearAllStats } from '@/components/CustomNode/customNode.js'
export default {
  data() {
    return {
      graph: null,
      data: {
        nodes: [
          { id: '1', parentId: null, label: 'Object 1' },
          { id: '2', parentId: '1', label: 'Object 2' },
          { id: '3', parentId: '1', label: 'Object 3' },
          { id: '4', parentId: '2', label: 'Object 4' },
          { id: '5', parentId: '2', label: 'Object 5' },
          { id: '6', parentId: '3', label: 'Object 6' },
          { id: '7', parentId: '3', label: 'Object 7' },
          { id: '8', parentId: '4', label: 'Object 8' },
          { id: '9', parentId: '4', label: 'Object 9' },
          { id: '10', parentId: '5', label: 'Object 10' },
        ]
      },
      data2: {
        nodes: [
          { id: '1', parentId: null, label: 'Object 1' },
          { id: '2', parentId: '1', label: 'Object 2' },
          { id: '3', parentId: '1', label: 'Object 3' },
          { id: '11', parentId: '1', label: 'Object 3' },
          { id: '4', parentId: '2', label: 'Object 4' },
          { id: '5', parentId: '2', label: 'Object 5' },
          { id: '6', parentId: '3', label: 'Object 6' },
          { id: '7', parentId: '3', label: 'Object 7' },
          { id: '10', parentId: '5', label: 'Object 10' },
        ]
      },

    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      const _this = this
      const container = this.$refs.container; // 更新获取容器的方式
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const graph = new G6.Graph({
        container: container,
        width,
        height,
        fitCenter: true,
        linkCenter: true,
        layout: {
          type: 'customTreeLayout',
        },
        animate: true,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
        },

      });
      this.graph = graph
      renderLayout(graph, this.data);
      graph.on("node:click", function (evt) {
        let { item } = evt;
        _this.data = _this.data2
        // renderLayout(graph, _this.data2);
        graph.changeData(_this.data2)
        // console.log(graph.changeData);
      });
      // 处理窗口大小变化的部分，根据需要取消注释
      if (typeof window !== "undefined") {
        window.onresize = () => {
          if (!graph || graph.get("destroyed")) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
      }
    },
  },
}
</script>

<style>
</style>