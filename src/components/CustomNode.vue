<template>
  <div>
    <div ref="graphContainer" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  data() {
    return {
      graph: null,
      data: {
        nodes: [
          {
            id: "circle-graph",
            size: 80,
            x: 150,
            y: 150,
            color: '#1abc9c',
            menu: [
              {
                id: 'pie1',
                title: '1',
                color: "#ccc",
                size: 140,
                label: '1',
                click: () => {
                  console.log('click1');
                },
                menu: [
                  {
                    id: 'pie11',
                    title: '11',
                    color: "#1abc9c",
                    size: 200,
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
                color: "#2ecc71",
                size: 140,
                label: '2',
                click: () => {
                  console.log('click2');
                },
                menu: [
                  {
                    id: 'pie11',
                    title: '11',
                    color: "#1abc9c",
                    size: 200,
                    label: '11',
                    click: () => {
                      console.log('click11');
                    }
                  }
                ]
              },
              {
                id: 'pie3',
                title: '3',
                size: 140,
                label: '3',
                color: "#3498db",
                click: () => {
                  console.log('click3');
                },
                menu: [
                  {
                    id: 'pie31',
                    title: '31',
                    color: "#1abc9c",
                    size: 200,
                    label: '31',
                    click: () => {
                      console.log('click31');
                    }
                  },
                  {
                    id: 'pie32',
                    title: '32',
                    color: "#fabc9c",
                    size: 200,
                    label: '32',
                    click: () => {
                      console.log('click32');
                    }
                  },
                ]
              },
              // {
              //   id: 'pie4',
              //   title: '4',
              //   color: "#f1c40f",
              //   size:140,
              //   label: '4',
              //   menu: [
              //     {
              //       id: 'pie41',
              //       title: '41',
              //       color: "#1abc9c",
              //       size: 200,
              //       label: '41',
              //       click: () => {
              //         console.log('click41');
              //       }
              //     },
              //     {
              //       id: 'pie42',
              //       title: '42',
              //       color: "#fabc9c",
              //       size: 200,
              //       label: '12',
              //       click: () => {
              //         console.log('click42');
              //       }
              //     },
              //   ]
              // },
              // { id: 'pie5', title: '5' ,color: "#e67e22",label: '5',size:140,},
              // { id: 'pie6', title: '6' ,color: "#f9bc8c",label: '6',size:140,},
              // { id: 'pie7', title: '7' ,color: "#e69e22",label: '7',},
            ]
          },
        ],
      },

    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    renderData() {
      G6.registerNode("pie-node", {
        draw: (cfg, group) => {
          const CMenu = group.addGroup({
            id: 'circular-menu',
            name: 'CMenu',
            capture: true,
            draggable: true,
            zIndex: 0
          })
          if (cfg.menu.length > 1) {
            cfg.menu.forEach((item, index) => {
              const radius = item.size / 2;
              function angles(index, len) {
                const anglePerSection = 2 * Math.PI / len;
                const startAngle = anglePerSection * (index + 1) - anglePerSection;
                const endAngle = anglePerSection * (index + 2) - anglePerSection >= 2 * Math.PI ? anglePerSection * (index + 2) - 2 * Math.PI - anglePerSection : anglePerSection * (index + 2) - anglePerSection;
                return {
                  startAngle,
                  endAngle
                };
              }
              const { startAngle, endAngle } = angles(index, cfg.menu.length);
              const isInBigArc = endAngle - startAngle > Math.PI ? 1 : 0;
              
              if (item.hasOwnProperty('menu') && item.menu.length > 0) {
                item.menu.forEach((menu2, index) => {
                  const menuTwoRadius = menu2.size / 2
                  const totalAngle = endAngle > 0 ? (endAngle - startAngle) / item.menu.length : (Math.PI * 2 - startAngle) / item.menu.length
                  const meunTwoStartAngle = startAngle + (index * totalAngle)
                  const meunTwoendAngle = startAngle + ((index + 1) * totalAngle)
                  const menuTwoIsInBigArc = meunTwoendAngle - meunTwoStartAngle > Math.PI ? 1 : 0;
                  CMenu.addShape("path", {
                    attrs: {
                      path: [
                        ["M", menuTwoRadius * Math.cos(meunTwoStartAngle), -menuTwoRadius * Math.sin(meunTwoStartAngle)],
                        [
                          "A",
                          menuTwoRadius,
                          menuTwoRadius,
                          0,
                          menuTwoIsInBigArc,
                          0,
                          menuTwoRadius * Math.cos(meunTwoendAngle),
                          -menuTwoRadius * Math.sin(meunTwoendAngle),
                        ],
                        ["L", 0, 0],
                        ["Z"],
                      ],
                      lineWidth: 0,
                      fill: menu2.color,
                      opacity: 0,
                      zIndex: 1
                    },
                    capture: true,
                    name: `menu2${menu2.id}`,
                  });
                  let labelX = (menuTwoRadius * Math.cos((meunTwoStartAngle + meunTwoendAngle) / 2)) / 1.25
                  let labelY = (menuTwoRadius * Math.sin((meunTwoStartAngle + meunTwoendAngle) / 2)) / 1.25
                  // if (item.menu.length === index + 1) {
                  //   labelX = -labelX
                  //   labelY = labelY
                  // } else {
                  //   labelX = labelX
                  //   labelY = -labelY
                  // }
                  CMenu.addShape('text', {
                    attrs: {
                      text: menu2.label,
                      x: labelX,
                      y: -labelY,
                      fontSize: 12,
                      textAlign: 'left',
                      textBaseline: 'middle',
                      fill: 'rgba(0,0,0,0.65)',
                      opacity: 0,
                      zIndex: 2
                    },
                    name: `menu2-label${menu2.id}`,
                  });
                })
              }
              CMenu.addShape("path", {
                attrs: {
                  path: [
                    ["M", radius * Math.cos(startAngle), -radius * Math.sin(startAngle)],
                    [
                      "A",
                      radius,
                      radius,
                      0,
                      isInBigArc,
                      0,
                      radius * Math.cos(endAngle),
                      -radius * Math.sin(endAngle),
                    ],
                    ["L", 0, 0],
                    ["Z"],
                  ],
                  lineWidth: 0,
                  fill: item.color,
                  opacity: 0,
                  zIndex: 0
                },
                capture: true,
                name: `menu${index}`,
              });
              let labelX = (radius * Math.cos((startAngle + endAngle) / 2)) / 1.5
              let labelY = (radius * Math.sin((startAngle + endAngle) / 2)) / 1.5
              if (cfg.menu.length === index + 1) {
                labelX = -labelX
                labelY = labelY
              } else {
                labelX = labelX
                labelY = -labelY
              }
              CMenu.addShape('text', {
                attrs: {
                  text: item.label,
                  x: labelX,
                  y: labelY,
                  fontSize: 12,
                  textAlign: 'left',
                  textBaseline: 'middle',
                  fill: 'rgba(0,0,0,0.65)',
                  opacity: 0,
                  zIndex: 2
                },
                name: `menu-label${index}`,
              });

            })
          } else {
            CMenu.addShape("circle", {
              attrs: {
                x: 0,
                y: 0,
                r: cfg.menu[0].size / 2, // 圆形半径
                fill: cfg.menu[0].color,
                lineWidth: 0,
              },
              capture: true,
              name: `menu1`,
            });
          }
          const circleGraph = group.addGroup({
            id: 'circle-graph',
            name: 'circleGraph',
            capture: true,
            draggable: true,
            zIndex: 1
          })
          circleGraph.addShape("circle", {
            attrs: {
              x: 0,
              y: 0,
              r: cfg.size / 2, // 圆形半径
              fill: cfg.color,
              lineWidth: 0,
            },
            capture: true,
            name: `circleGraph`,
          })
          return null;
        },
        afterDraw(cfg, group) {
          const circleGraphGroup = group.findById('circle-graph')
          const circleGraph = group.find((element) => element.get('name') === `circleGraph`);
          circleGraph.on('mouseenter', () => {
            const CMenuGroup = group.findById('circular-menu')
            CMenuGroup.show()
            CMenuGroup.attr('opacity', 1);
            if (cfg.hasOwnProperty('menu') && cfg.menu.length > 0) {
              cfg.menu.forEach((menu, index) => {
                const CMenuItem = group.find((element) => element.get('name') === `menu${index}`);
                const CMenulabel = group.find((element) => element.get('name') === `menu-label${index}`);
                CMenuItem.attr('opacity', 1);
                CMenulabel.attr('opacity', 1);
              })
            }
            group.get('canvas').draw();
          });
          circleGraph.on('mouseleave', () => {
            // circleGraph.attr('fill', originalFill);
            const CMenuGroup = group.findById('circular-menu')
            // CMenuGroup.children.forEach((item)=>{

            // })
            // console.log(CMenuGroup);
            group.get('canvas').draw();
          });
          // circleGraph.on('click', () => {
          //   if (cfg.menu[i].hasOwnProperty('click')) {
          //     cfg.menu[i].click()
          //   }
          //   // group.clear()

          //   CMenuGroup.clear()
          //   console.log(CMenuGroup);
          // });
          for (let i = 0; i < cfg.menu.length; i++) {
            const CMenuGroup = group.findById('circular-menu')
            const CMenuItem = group.find((element) => element.get('name') === `menu${i}`);

            const originalFill = CMenuItem.attrs.fill

            CMenuItem.on('mouseenter', () => {
              CMenuItem.attr('fill', '#ccc');
              if (CMenuItem.attrs.opacity === 1) {
                if (cfg.menu[i].hasOwnProperty('menu') && cfg.menu[i].menu.length > 0) {
                  // console.log(CMenuItem, 123);
                  cfg.menu[i].menu.forEach((menu2, index) => {
                    const CMenu2Item = group.find((element) => element.get('name') === `menu2${menu2.id}`);
                    const CMenu2label = group.find((element) => element.get('name') === `menu2-label${menu2.id}`);
                    // console.log(CMenu2Item, CMenu2label);
                    CMenu2Item.attr('opacity', 1);
                    CMenu2label.attr('opacity', 1);
                  })
                }
              }

              // console.log(cfg.menu[i].menu);
              group.get('canvas').draw();
            });
            CMenuItem.on('mouseleave', () => {
              CMenuItem.attr('fill', originalFill);
              group.get('canvas').draw();
            });
            CMenuItem.on('click', () => {
              if (cfg.menu[i].hasOwnProperty('click')) {
                cfg.menu[i].click()
              }
              // group.clear()

              CMenuGroup.hide()
              // console.log(CMenuGroup);
            });
            if (cfg.menu[i].hasOwnProperty('menu') && cfg.menu[i].menu.length > 0) {
              cfg.menu[i].menu.forEach((menu2, index) => {
                const CMenu2Item = group.find((element) => element.get('name') === `menu2${menu2.id}`);
                const CMenu2OriginalFill = CMenu2Item.attrs.fill
                CMenu2Item.on('mouseenter', () => {
                  CMenu2Item.attr('fill', '#ccc');
                  group.get('canvas').draw();
                });
                CMenu2Item.on('mouseleave', () => {
                  CMenu2Item.attr('fill', CMenu2OriginalFill);
                  // if (cfg.menu[i].hasOwnProperty('menu') && cfg.menu[i].menu.length > 0) {
                  //   cfg.menu[i].menu.forEach((menu2, index) => {
                  //     const CMenu2Item = group.find((element) => element.get('name') === `menu2${menu2.id}`);
                  //     CMenu2Item.attr('opacity', 0);
                  //   })
                  // }
                  group.get('canvas').draw();
                });
                CMenu2Item.on('click', () => {
                  if (menu2.hasOwnProperty('click')) {
                    menu2.click()
                  }

                  CMenuGroup.hide()
                });
              })

            }
          }
        },
        update(cfg, node) {
          for (let i = 0; i < cfg.menu.length; i++) {
            const CMenuItem = node.find((element) => element.get('name') === `menu${i}`);
            console.log(CMenuItem);
            CMenuItem.cfg.attrs.fill = '#ccc'
          }
        },
        setState(name, value, item) {
          console.log(name, value, item);
        }

      });
    },
    init() {

      const container = this.$refs.graphContainer; // 更新获取容器的方式

      const graph = new G6.Graph({
        container: container,
        width: 500,
        height: 500,
        fitCenter: true,
        linkCenter: true,
        defaultNode: {
          type: "pie-node",
        },
      });

      this.graph = graph; // 保存图表实例的引用

      graph.data(this.data);
      graph.render();

      graph.on("node:click", function (evt) {
        let { item } = evt;
        console.log(item);
      });
      // 处理窗口大小变化的部分，根据需要取消注释
      // if (typeof window !== "undefined") {
      //   window.onresize = () => {
      //     if (!graph || graph.get("destroyed")) return;
      //     if (!container || !container.scrollWidth || !container.scrollHeight)
      //       return;
      //     graph.changeSize(container.scrollWidth, container.scrollHeight);
      //   };
      // }
    },
  },
  created() {
    this.renderData();
  },
  beforeDestroy() {
    this.graph && this.graph.destroy(); // 销毁图表实例
  },
};
</script>
