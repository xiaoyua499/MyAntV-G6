<template>
  <div ref="graphContainer" style="width: 100%; height: 100%"></div>
</template>

<script>
import G6 from "@antv/g6";
import { renderData, graphHighlight, clearAllStats } from '@/components/customNode.js'
export default {
  data() {
    return {
      graph: null,
      data: {
        nodes: [
          {
            id: "circle-graph",
            label: '系统业务能力名称',
            tag: '系统业务能力',
            circleSize: 122,
            menuSize1: 230,
            menuSize2: 330,
            color: '#60D7A7',
            menu: [
              {
                id: 'pie111',
                title: '系统业务能力名称',
                color: "#E5E5E5",
                label: '系统业务能力名称',
                click: () => {
                  console.log('click1');
                }
              },
              // {
              //   id: 'pie211',
              //   title: '系统业务能力名称',
              //   color: "#E5E5E5",
              //   label: '系统业务能力名称',
              //   click: () => {
              //     console.log('click1');
              //   }
              // }
            ],
          },
        ],
        edges: []
      }

    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      const container = this.$refs.graphContainer; // 更新获取容器的方式
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const graph = new G6.Graph({
        container: container,
        width,
        height,
        fitCenter: true,
        linkCenter: true,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
        },
        defaultNode: {
          type: "customNode",
        },

      });

      graph.on("node:click", function (evt) {
        let { item } = evt;
      });
      graph.on('node:mouseleave', (e) => {
        clearAllStats(graph)
      });
      graph.on('node:mouseenter', function (e) {
        const item = e.item;
        graphHighlight(graph, item)
      });
      this.graph = graph
      renderData(graph, this.data);
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
  created() {

  },
  beforeDestroy() {
    this.graph && this.graph.destroy(); // 销毁图表实例
  },
};
</script>
