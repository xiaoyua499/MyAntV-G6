<template>
  <div>
    <div ref="graphContainer" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { renderData, graphHighlight, clearAllStats } from '@/components/customNode.js'
export default {
  data() {
    return {
      graph: null,
      data: {
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
        children: [
          {
            id: "circle-graph1",
            label: '系统业务能力名称',
            tag: '系统业务能力',
            circleSize: 122,
            menuSize1: 230,
            menuSize2: 330,
            color: '#1abc9c',
            menu: [
              {
                id: 'pie1',
                title: '1',
                color: "#E5E5E5",
                label: '1',
                click: () => {
                  console.log('click1');
                },
                menu: [
                  {
                    id: 'pie11',
                    title: '11',
                    color: "#E5E5E5",
                    label: '11',
                    click: () => {
                      console.log('click11');
                    }
                  }
                ]
              },
              {
                id: 'pie2',
                title: '2',
                color: "#E5E5E5",
                label: '2',
                click: () => {
                  console.log('click2');
                },
                // menu: [
                //   {
                //     id: 'pie11',
                //     title: '11',
                //     color: "#1abc9c",
                //     size: 200,
                //     label: '11',
                //     click: () => {
                //       console.log('click11');
                //     }
                //   }
                // ]
              },
            ],
            children: [
              {
                id: "circle-graph4",
                label: '系统业务能力名称',
                tag: '系统业务能力',
                circleSize: 122,
                menuSize1: 230,
                menuSize2: 330,
                color: '#1abc9c',
                menu: [
                  {
                    id: 'pie1',
                    title: '1',
                    color: "#E5E5E5",
                    label: '1',
                    click: () => {
                      console.log('click1');
                    },
                    menu: [
                      {
                        id: 'pie11',
                        title: '11',
                        color: "#E5E5E5",
                        label: '11',
                        click: () => {
                          console.log('click11');
                        }
                      }
                    ]
                  },
                  {
                    id: 'pie2',
                    title: '2',
                    color: "#E5E5E5",
                    label: '2',
                    click: () => {
                      console.log('click2');
                    },
                    // menu: [
                    //   {
                    //     id: 'pie11',
                    //     title: '11',
                    //     color: "#1abc9c",
                    //     size: 200,
                    //     label: '11',
                    //     click: () => {
                    //       console.log('click11');
                    //     }
                    //   }
                    // ]
                  },
                ],

              },
              {
                id: "circle-graph5",
                label: '系统业务能力名称',
                tag: '系统业务能力',
                circleSize: 122,
                menuSize1: 230,
                menuSize2: 330,
                color: '#1abc9c',
                menu: [
                  {
                    id: 'pie1',
                    title: '1',
                    color: "#E5E5E5",
                    label: '1',
                    click: () => {
                      console.log('click1');
                    },
                    menu: [
                      {
                        id: 'pie11',
                        title: '11',
                        color: "#E5E5E5",
                        label: '11',
                        click: () => {
                          console.log('click11');
                        }
                      }
                    ]
                  },
                  {
                    id: 'pie2',
                    title: '2',
                    color: "#E5E5E5",
                    label: '2',
                    click: () => {
                      console.log('click2');
                    },
                    // menu: [
                    //   {
                    //     id: 'pie11',
                    //     title: '11',
                    //     color: "#1abc9c",
                    //     size: 200,
                    //     label: '11',
                    //     click: () => {
                    //       console.log('click11');
                    //     }
                    //   }
                    // ]
                  },
                ]
              },

            ]
          },
          {
            id: "circle-graph2",
            label: '系统业务能力名称',
            tag: '系统业务能力',
            circleSize: 122,
            menuSize1: 230,
            menuSize2: 330,
            color: '#1abc9c',
            menu: [
              {
                id: 'pie1',
                title: '1',
                color: "#E5E5E5",
                label: '1',
                click: () => {
                  console.log('click1');
                },
                menu: [
                  {
                    id: 'pie11',
                    title: '11',
                    color: "#E5E5E5",
                    label: '11',
                    click: () => {
                      console.log('click11');
                    }
                  }
                ]
              },
              {
                id: 'pie2',
                title: '2',
                color: "#E5E5E5",
                label: '2',
                click: () => {
                  console.log('click2');
                },
                // menu: [
                //   {
                //     id: 'pie11',
                //     title: '11',
                //     color: "#1abc9c",
                //     size: 200,
                //     label: '11',
                //     click: () => {
                //       console.log('click11');
                //     }
                //   }
                // ]
              },
            ]
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
      const container = this.$refs.graphContainer; // 更新获取容器的方式
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const graph = new G6.TreeGraph({
        container: container,
        width,
        height,
        fitCenter: true,
        linkCenter: true,
        modes: {
          default: [{
            type: 'collapse-expand',
            onChange: function onChange(item, collapsed) {
              const data = item.getModel();
              data.collapsed = collapsed;
              return true;
            },
            shouldBegin: (e, self) => {
              const target = e.target.cfg
              const group = target.parent.cfg//当前节点被点击的组
              // 若当前操作的节点的组 id 为 'circular-menu'或'circular-menu2'，则不发生 collapse-expand
              if (e.target.group && (group.id === 'circular-menu'||group.id === 'circular-menu2')) return false;
              return true;
            },
          }, 'drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
        },
        defaultNode: {
          type: "customNode",
        },
        layout: {
          type: 'compactBox',
          direction: 'TB',
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 100;
          },
          getWidth: function getWidth() {
            return 100;
          },
          getVGap: function getVGap() {
            return 80;
          },
          getHGap: function getHGap() {
            return 20;
          },
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
