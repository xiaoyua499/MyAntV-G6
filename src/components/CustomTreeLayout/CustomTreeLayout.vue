<template>
  <div ref="container" style="width: 100%; height: 100%;"></div>
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
          {
            id: "circle-graph",
            label: '系统',
            tag: '系统业务能力',
            circleSize: 122,
            menuSize1: 230,
            menuSize2: 330,
            color: '#60D7A7',
            children: [
              {
                id: "circle-graph1",
                label: '1',
                tag: '系统业务能力',
                circleSize: 122,
                menuSize1: 230,
                menuSize2: 330,
                color: '#1abc9c',
                menu: [
                  {
                    id: 'pie1121',
                    title: '系统业务能力名称',
                    color: "#E5E5E5",
                    label: '系统业务能力名称',
                    click: () => {
                      console.log('click1');
                    }
                  }
                ],
                children: [
                  {
                    id: "circle-graph4",
                    label: '11',
                    tag: '系统业务能力',
                    circleSize: 122,
                    menuSize1: 230,
                    menuSize2: 330,
                    color: '#1abc9c',
                    menu: [
                      {
                        id: 'pie11441',
                        title: '系统业务能力名称',
                        color: "#E5E5E5",
                        label: '系统业务能力名称',
                        click: () => {
                          console.log('click1');
                        }
                      }
                    ],
                  },
                  {
                    id: "circle-graph5",
                    label: '12',
                    tag: '系统业务能力',
                    circleSize: 122,
                    menuSize1: 230,
                    menuSize2: 330,
                    color: '#1abc9c',
                    menu: [
                      {
                        id: 'pie144111',
                        title: '系统业务能力名称',
                        color: "#E5E5E5",
                        label: '系统业务能力名称',
                        click: () => {
                          console.log('click1');
                        }
                      }
                    ],
                  },

                ]
              },
              {
                id: "circle-graph11",
                label: '1',
                tag: '系统业务能力',
                circleSize: 122,
                menuSize1: 230,
                menuSize2: 330,
                color: '#1abc9c',
                menu: [
                  {
                    id: 'pie111uu',
                    title: '系统业务能力名称',
                    color: "#E5E5E5",
                    label: '系统业务能力名称',
                    click: () => {
                      console.log('click1');
                    }
                  }
                ],
                children: [
                  {
                    id: "circle-graph41",
                    label: '11',
                    tag: '系统业务能力',
                    circleSize: 122,
                    menuSize1: 230,
                    menuSize2: 330,
                    color: '#1abc9c',
                    menu: [
                    ],
                  },
                  {
                    id: "circle-graph51",
                    label: '12',
                    tag: '系统业务能力',
                    circleSize: 122,
                    menuSize1: 230,
                    menuSize2: 330,
                    color: '#1abc9c',
                    menu: [
                    ],
                  },

                ]
              },
              {
                id: "circle-graph2",
                label: '2',
                tag: '系统业务能力',
                circleSize: 122,
                menuSize1: 230,
                menuSize2: 330,
                color: '#1abc9c',
                menu: [
                    ],
                children: [
                  {
                    id: "circle-graph7",
                    label: '21',
                    tag: '系统业务能力',
                    circleSize: 122,
                    menuSize1: 230,
                    menuSize2: 330,
                    color: '#1abc9c',
                    menu: [
                    ],
                  },
                  {
                    id: "circle-graph8",
                    label: '22',
                    tag: '系统业务能力',
                    circleSize: 122,
                    menuSize1: 230,
                    menuSize2: 330,
                    color: '#1abc9c',
                    menu: [
                    ],
                  },

                ]
              },

            ],
            menu: [
              {
                id: 'pie111',
                title: '系统业务能力名称',
                color: "#E5E5E5",
                label: '系统业务能力名称',
                click: () => {
                  console.log('click1');
                }
              }
            ],
          },
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
      const container = this.$refs.container; // 更新获取容器的方式
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const graph = new G6.Graph({
        container: container,
        width,
        height,
        fitCenter: true,
        linkCenter: true,
        defaultNode: {
          type: "customNode",
        },
        layout: {
          type: 'customTreeLayout',
        },
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
        },

      });
      this.graph = graph
      renderData(graph, this.data);
      renderLayout(graph, this.data);
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