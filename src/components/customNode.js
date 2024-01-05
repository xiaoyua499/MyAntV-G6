import G6 from "@antv/g6";

function wrapString(str) {
  if (str) {
    str.replace(/\n/g, '')
    if (str.length > 6 && str.length <= 9) {
      return str.slice(0, 6) + '\n' + wrapString(str.slice(6))
    } else if (str.replace(/\n/g, '').length === 10) {
      return str.slice(0, 6) + '\n' + str.replace(/\n/g, '').slice(6, 10)
    } else if (str.replace(/\n/g, '').length > 10) {
      return str.slice(0, 6) + '\n' + str.replace(/\n/g, '').slice(6, 10) + '...'
    } else {
      return str
    }
  }
}

/**
 * 获取每个菜单的起始弧度和结束弧度
 * @param {number} index 菜单序号
 * @param {number} num 菜单个数
 */
function angles(index, num) {
  const anglePerSection = 2 * Math.PI / num;//菜单的弧度
  const startAngle = anglePerSection * (index + 1) - anglePerSection;//菜单的起始弧度
  //菜单的结束弧度
  const endAngle = anglePerSection * (index + 2) - anglePerSection >= 2 * Math.PI ? anglePerSection * (index + 2) - 2 * Math.PI - anglePerSection : anglePerSection * (index + 2) - anglePerSection;
  return {
    startAngle,
    endAngle
  };
}
/**
 * 高亮当前和相邻的节点
 * @param {Object} graph 当前图谱
 * @param {Object} item 当前节点
 */
export function graphHighlight(graph, item) {
  graph.setAutoPaint(false);
  graph.getNodes().forEach(function (node) {
    graph.clearItemStates(node);
    graph.setItemState(node, 'dark', true);
  });
  graph.setItemState(item, 'dark', false);
  graph.setItemState(item, 'highlight', true);
  graph.getEdges().forEach(function (edge) {
    if (edge.getSource() === item) {
      graph.setItemState(edge.getTarget(), 'dark', false);
      graph.setItemState(edge.getTarget(), 'highlight', true);
      graph.setItemState(edge, 'highlight', true);
      edge.toFront();
    } else if (edge.getTarget() === item) {
      graph.setItemState(edge.getSource(), 'dark', false);
      graph.setItemState(edge.getSource(), 'highlight', true);
      graph.setItemState(edge, 'highlight', true);
      edge.toFront();
    } else {
      graph.setItemState(edge, 'highlight', false);
    }
  });
  graph.paint();
  graph.setAutoPaint(true);
}

/**
 * 清楚当前图谱中的状态，例如：清楚高亮
 * @param {Object} graph 当前图谱 
 */
export function clearAllStats(graph) {
  graph.setAutoPaint(false);
  graph.getNodes().forEach(function (node) {
    graph.clearItemStates(node);
  });
  graph.getEdges().forEach(function (edge) {
    graph.clearItemStates(edge);
  });
  graph.paint();
  graph.setAutoPaint(true);
}

//初始化自定义节点
export function renderData(graph, data) {
  G6.registerNode("customNode", {
    draw: (cfg, group) => {
      //圆形节点组
      const circleGraph = group.addGroup({
        id: 'circle-graph',
        name: 'circleGraph',
        capture: true,
        draggable: true,
        zIndex: 2
      })
      //环形菜单第一层
      const CMenu = group.addGroup({
        id: 'circular-menu',
        name: 'CMenu',
        capture: true,
        visible: false,
        zIndex: 1
      })
      //环形菜单第二层
      const CMenu2 = group.addGroup({
        id: 'circular-menu2',
        name: 'CMenu2',
        capture: true,
        visible: false,
        zIndex: 0
      })
      if (cfg.hasOwnProperty('menu') && cfg.menu.length > 1) {
        cfg.menu.forEach((item, index) => {
          const radius = cfg.menuSize1 / 2;//环形菜单半径
          const { startAngle, endAngle } = angles(index, cfg.menu.length);
          const isInBigArc = endAngle - startAngle > Math.PI ? 1 : 0; //是否为最大弧度
          //第一层菜单的扇形
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
              lineWidth: 1,
              stroke: '#fff',
              fill: item.color,
              cursor: 'pointer',
              opacity: 1,
              zIndex: 1
            },
            capture: true,
            name: `menu${index}`,
          });
          //菜单名称的坐标
          let labelX = (radius * Math.cos((startAngle + endAngle) / 2)) / 1.5
          let labelY = (radius * Math.sin((startAngle + endAngle) / 2)) / 1.5
          if (cfg.menu.length === index + 1) {
            labelX = -labelX
            labelY = labelY
          } else {
            labelX = labelX
            labelY = -labelY
          }
          //菜单名称
          CMenu.addShape('text', {
            attrs: {
              text: item.label,
              x: labelX,
              y: labelY,
              fontSize: 12,
              textAlign: 'center',
              textBaseline: 'middle',
              fill: 'rgba(0,0,0,0.65)',
              opacity: 1,
              zIndex: 1
            },
            name: `menu-label${index}`,
          });
          //判断是否有第二层环形菜单
          if (item.hasOwnProperty('menu') && item.menu.length > 0) {
            item.menu.forEach((menu2, index) => {
              const menuTwoRadius = cfg.menuSize2 / 2
              //根据第一层菜单的起始和结束弧度算出第二层菜单的总弧度
              const totalAngle = endAngle > 0 ? (endAngle - startAngle) / item.menu.length : (Math.PI * 2 - startAngle) / item.menu.length
              const meunTwoStartAngle = startAngle + (index * totalAngle)
              const meunTwoendAngle = startAngle + ((index + 1) * totalAngle)
              const menuTwoIsInBigArc = meunTwoendAngle - meunTwoStartAngle > Math.PI ? 1 : 0;
              //第二层菜单的扇形
              CMenu2.addShape("path", {
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
                  lineWidth: 1,
                  stroke: '#fff',
                  fill: menu2.color,
                  cursor: 'pointer',
                  opacity: 0,
                  zIndex: 0
                },
                capture: true,
                name: `menu2${menu2.id}`,
              });
              let labelX = (menuTwoRadius * Math.cos((meunTwoStartAngle + meunTwoendAngle) / 2)) / 1.25
              let labelY = (menuTwoRadius * Math.sin((meunTwoStartAngle + meunTwoendAngle) / 2)) / 1.25
              //第二层菜单的名称
              CMenu2.addShape('text', {
                attrs: {
                  text: menu2.label,
                  x: labelX,
                  y: -labelY,
                  fontSize: 12,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  fill: 'rgba(0,0,0,0.65)',
                  opacity: 0,
                  zIndex: 2
                },
                name: `menu2-label${menu2.id}`,
              });
            })
          }
        })
      } else if (cfg.hasOwnProperty('menu') && cfg.menu.length === 1) {
        //当第一层只有一个菜单时，环形菜单为一个圆环
        CMenu.addShape("circle", {
          attrs: {
            x: 0,
            y: 0,
            r: cfg.menuSize1 / 2, // 圆形半径
            fill: cfg.menu[0].color,
            lineWidth: 0,
            cursor: 'pointer',
          },
          capture: true,
          name: `menu0`,
        });
        CMenu.addShape('text', {
          attrs: {
            text: cfg.menu[0].label,
            x: 0,
            y: -cfg.menuSize1 / 2.6,
            fontSize: 12,
            textAlign: 'center',
            textBaseline: 'middle',
            fill: 'rgba(0,0,0,0.65)',
            opacity: 1,
            zIndex: 1
          },
          name: `menu-label0`,
        });
      }

      //外层白圆
      circleGraph.addShape("circle", {
        attrs: {
          x: 0,
          y: 0,
          r: cfg.circleSize / 2 + 5, // 圆形半径
          fill: '#fff',
          lineWidth: 0,
          stroke: cfg.color,
          cursor: 'pointer',
          zIndex: 1
        },
        capture: true,
        draggable: true,
        name: `circleGraph1`,
      })
      //圆形节点
      const circleNode = circleGraph.addShape("circle", {
        attrs: {
          x: 0,
          y: 0,
          r: cfg.circleSize / 2, // 圆形半径
          fill: cfg.color,
          lineWidth: 0,
          stroke: '#fff',
          cursor: 'pointer',
          zIndex: 1
        },
        capture: true,
        draggable: true,
        name: `circleGraph2`,
      })
      //节点下面的椭圆阴影
      if (cfg.hasOwnProperty('tag') && cfg.tag) {
        const xOffset = -cfg.circleSize / 2.65;//x轴偏移
        const yOffset = cfg.circleSize / 3.46;//y轴偏移
        circleGraph.addShape("path", {
          attrs: {
            path: [
              ["M", 45.5876 + xOffset, 25.6 + yOffset],
              ["C", 27.3311 + xOffset, 25.5719 + yOffset, 10.9863 + xOffset, 17.39 + yOffset, 0 + xOffset, 4.50111 + yOffset],
              ["C", 11.0052 + xOffset, 1.74675 + yOffset, 27.3875 + xOffset, 0 + yOffset, 45.682 + xOffset, 0 + yOffset],
              ["C", 63.9767 + xOffset, 0 + yOffset, 80.3589 + xOffset, 1.74675 + yOffset, 91.3641 + xOffset, 4.50111 + yOffset],
              ["C", 80.3778 + xOffset, 17.39 + yOffset, 64.033 + xOffset, 25.5719 + yOffset, 45.7765 + xOffset, 25.6 + yOffset],
              ["C", 45.745 + xOffset, 25.6 + yOffset, 45.7135 + xOffset, 25.6 + yOffset],
              ["L", 45.5876 + xOffset, 25.62 + yOffset],
              ["Z", xOffset, yOffset]
            ],
            lineWidth: 0,
            stroke: '#fff',
            fill: "#000",
            cursor: 'pointer',
            opacity: 0.1,
            zIndex: 1
          },
          capture: true,
          name: `intersection`,
        });
      }
      //标题
      circleGraph.addShape('text', {
        attrs: {
          text: wrapString(cfg.label),
          fontSize: 18,
          textAlign: 'center',
          textBaseline: 'middle',
          fill: '#fff',
          lineHeight: 24,
          cursor: 'pointer',
          opacity: 1,
          zIndex: 1
        },
        draggable: true,
        name: `circleGraph-label`,
      });
      //标签
      circleGraph.addShape('text', {
        attrs: {
          text: cfg.tag,
          y: cfg.circleSize / 2.65,
          fontSize: 10,
          textAlign: 'center',
          textBaseline: 'middle',
          fill: '#fff',
          lineHeight: 24,
          cursor: 'pointer',
          opacity: 1,
          zIndex: 1
        },
        draggable: true,
        name: `circleGraph-tag`,
      });
      return circleNode;
    },
    afterDraw(cfg, group) {
      group.sort()
      const circleGraphGroup = group.findById('circle-graph')
      const circleGraph1 = group.find((element) => element.get('name') === `circleGraph1`);
      const circleGraph2 = group.find((element) => element.get('name') === `circleGraph2`);
      const CMenu_1Group = group.findById('circular-menu')
      const CMenu_2Group = group.findById('circular-menu2')
      //开始拖动节点，隐藏环形菜单
      circleGraphGroup.on('dragstart', () => {
        CMenu_1Group.hide()
        CMenu_2Group.hide()
      })
      //结束拖动节点，显示环形菜单
      circleGraphGroup.on('dragend', () => {
        CMenu_1Group.show()
        // CMenu_2Group.show()
      })
      circleGraphGroup.on('mouseenter', () => {
        circleGraph1.attr('lineWidth', 2)
        CMenu_1Group.show()
        group.get('canvas').draw();
      });
      circleGraphGroup.on('mouseleave', () => {
        group.get('canvas').draw();
      });
      group.on('mouseleave', () => {
        CMenu_1Group.hide()
        CMenu_2Group.hide()
        circleGraph1.attr('lineWidth', 0)
        group.get('canvas').draw();
      })
      for (let i = 0; i < cfg.menu.length; i++) {
        const CMenuData = cfg.menu[i]
        const CMenuItem = group.find((element) => element.get('name') === `menu${i}`);
        const CMenuLabel = group.find((element) => element.get('name') === `menu-label${i}`);
        const originalFill = CMenuItem.attrs.fill
        const labelOriginalFill = CMenuLabel.attrs.fill
        //第一层菜单鼠标移入事件
        const CMenuMouseenter = () => {
          CMenuItem.attr('fill', '#444');
          CMenuLabel.attr('fill', '#fff');
          if (cfg.menu.length > 1) {
            if (CMenuData.hasOwnProperty('menu') && CMenuData.menu.length > 0) {
              CMenu_2Group.find(function (item) {
                item.attr('opacity', 0)
              })
              CMenuData.menu.forEach(menu => {
                const CMenu2_pie = CMenu_2Group.find(function (item) {
                  return item.cfg.name === `menu2${menu.id}`;
                })
                const CMenu2_label = CMenu_2Group.find(function (item) {
                  return item.cfg.name === `menu2-label${menu.id}`;
                })
                if (CMenu2_pie.attr('opacity') === 0) {
                  CMenu2_pie.attr('opacity', 1)
                } else {
                  CMenu2_pie.attr('opacity', 0)
                }
                CMenu2_label.attr('opacity', 1)
              })
              CMenu_2Group.show()
            }
          }
          group.get('canvas').draw();
        }
        //第一层菜单点击事件
        const CMenuClick = () => {
          if (cfg.menu[i].hasOwnProperty('click')) {
            cfg.menu[i].click()
          }
          CMenu_1Group.hide()
          CMenu_2Group.hide()
        }
        CMenuItem.on('mouseenter', CMenuMouseenter);
        CMenuLabel.on('mouseenter', CMenuMouseenter);
        CMenuItem.on('mouseleave', () => {
          CMenuItem.attr('fill', originalFill);
          CMenuLabel.attr('fill', labelOriginalFill);
          group.get('canvas').draw();
        });
        CMenuItem.on('click', CMenuClick);
        CMenuLabel.on('click', CMenuClick);
        //第二层菜单事件
        if (CMenuData.hasOwnProperty('menu') && CMenuData.menu.length > 0) {
          CMenuData.menu.forEach((menu2, index) => {
            const CMenu2Item = group.find((element) => element.get('name') === `menu2${menu2.id}`);
            const CMenu2Label = group.find((element) => element.get('name') === `menu2-label${menu2.id}`);
            const CMenu2OriginalFill = CMenu2Item.attrs.fill
            const CMenu2LabelOriginalFill = CMenu2Label.attrs.fill
            //第二层菜单点击事件
            const CMenu2Click = () => {
              if (menu2.hasOwnProperty('click')) {
                menu2.click()
              }
              CMenu_1Group.hide()
              CMenu_2Group.hide()
            }
            //第二层菜单鼠标移入事件
            const CMenu2Mouseenter = () => {
              CMenu2Item.attr('fill', '#444');
              CMenu2Label.attr('fill', '#fff');
              group.get('canvas').draw();
            }
            CMenu2Item.on('mouseenter', CMenu2Mouseenter);
            CMenu2Label.on('mouseenter', CMenu2Mouseenter);
            CMenu2Item.on('mouseleave', () => {
              CMenu2Item.attr('fill', CMenu2OriginalFill);
              CMenu2Label.attr('fill', CMenu2LabelOriginalFill);
              group.get('canvas').draw();
            });
            CMenu2Item.on('click', CMenu2Click);
            CMenu2Label.on('click', CMenu2Click);
          })

        }
      }
    },
    update(cfg, node) {
      // console.log(cfg,node);
      const keyShape = node.getKeyShape()
      keyShape.attr({
        ...cfg.style
      })
    },
    setState(name, value, item) {
      if (name === 'dark' && value === true) {
        const itemModel = item.getModel()
        itemModel.style = {
          opacity: 0.2
        }
        this.update(itemModel, item)
      }
      if ((name === 'highlight' && value === true) || (name === 'dark' && value === false)) {
        const itemModel = item.getModel()
        itemModel.style = {
          opacity: 1
        }
        this.update(itemModel, item)
      }
    }

  });

  graph.data(data);
  graph.render();
}