import G6 from "@antv/g6";
import { renderData, graphHighlight, clearAllStats } from '@/components/CustomNode/customNode.js'

export function renderLayout(graph, data) {
  //获取边
  function getEdges(nodes) {
    const edges = [];
    nodes.forEach(item => {
      if (item.parentId !== null) {
        edges.push({
          source: item.id,
          target: item.parentId || null
        });
      }
    });
    return edges;
  }
  //树形数据转数组对象
  function treesToArray(trees) {
    const array = [];

    function traverse(node) {
      const { children, ...rest } = node;
      array.push(rest);
      if (children) {
        children.forEach(child => traverse(child));
      }
    }

    trees.forEach(tree => traverse(tree));

    return array;
  }
  //数组对象转树形数据
  function arrayToTree(array) {
    const map = {};
    const trees = [];

    array.forEach(item => {
      const layer = item.parentId === null ? 0 : map[item.parentId].layer + 1;
      const x = 0;
      const y = layer * 200;

      const newItem = { ...item, children: [], layer, x, y };
      map[item.id] = newItem;

      if (item.parentId !== null) {
        newItem.parent = map[item.parentId];
      }
    });

    array.forEach(item => {
      if (item.parentId !== null) {
        map[item.parentId].children.push(map[item.id]);
      } else {
        trees.push(map[item.id]);
      }
    });

    return trees;
  }


  // const treeData = arrayToTree(data.nodes)
  // console.log(treeData);
  // renderData(graph, data.nodes[0])
  G6.registerLayout('customTreeLayout', {
    /**
     * 定义自定义行为的默认参数，会与用户传入的参数进行合并
     */
    getDefaultCfg() {
      return {
        nodeSize: 122,//节点大小
        nodeSep: 100,//节点横向间距
        rankSep: 60,//节点纵向间距
      };
    },
    /**
     * 执行布局
     */
    execute() {
      const self = this;
      const edges = getEdges(self.nodes)
      edges.forEach(edge => {
        graph.addItem('edge', edge)
      })
      self.edges = edges;
      const treeData = arrayToTree(self.nodes)
      const count = 0
      const nodeWidth = self.nodeSize
      const nodeHeight = self.nodeSize
      var nodeInterval = self.nodeSep + nodeWidth
      const yInterval = self.rankSep + nodeHeight
      const rootX = 400
      const rootY = 80
      let hashTree = []
      const renderRequestCount = 0
      const renderCount = 0
      const root = treeData[0]
      //执行布局
      const treeLayout = () => {
        hashTree = generateArraysByLevel(root)
        layoutChild(root);
        layoutOverlaps();
      }
      const generateArraysByLevel = (tree) => {
        const levels = {}; // 创建一个空对象来存储每个层级的节点

        function traverse(node, level) {
          if (!levels[level]) {
            levels[level] = []; // 如果当前层级还没有节点，创建一个空数组
          }

          levels[level].push(node); // 将当前节点添加到对应层级的数组中

          if (node.children) {
            node.children.forEach(child => {
              traverse(child, level + 1); // 递归遍历子节点，并增加层级
            });
          }
        }

        traverse(tree, 0); // 从根节点开始遍历

        // 将对象转换为数组以便输出
        const result = Object.values(levels);

        return result;
      }

      const findCommonParentNode = (node1, node2) => {
        if (node1.parent === node2.parent) {
          return node2;
        } else {
          return findCommonParentNode(node1.parent, node2.parent);
        }
      }

      const translateTree = (node, x) => {
        let dx = x - node.x;
        node.x = x;
        node.ox = node.x
        for (let i = 0; i < node.children.length; i++) {
          translateTree(node.children[i], node.children[i].x + dx);
        }
      }

      const layoutOverlaps = () => {
        for (let i = hashTree.length - 1; i >= 0; i--) {
          let curLayer = hashTree[i];
          for (let j = 0; j < curLayer.length - 1; j++) {
            let n1 = curLayer[j], n2 = curLayer[j + 1];
            if (isOverlaps(n1, n2)) {
              let dx = n1.x + nodeInterval - n2.x
              let node2Move = findCommonParentNode(n1, n2);

              translateTree(node2Move, node2Move.x + dx);
              centerChild(node2Move.parent);

              i = hashTree.length;
            }
          }
        }
      }
      const centerChild = (parent) => {
        let dx = 0;

        if (parent === null) return;

        if (parent.children.length === 1) {
          dx = parent.x - parent.children[0].x;
        }

        if (parent.children.length > 1) {
          dx = parent.x - (parent.children[0].x + (parent.children[parent.children.length - 1].x - parent.children[0].x) / 2);
        }

        if (dx) {
          for (let i = 0; i < parent.children.length; i++) {
            translateTree(parent.children[i], parent.children[i].x + dx);
          }
        }
      }
      const layoutChild = (node) => {
        if (node.children.length === 0) return;
        else {
          let start = node.x - (node.children.length - 1) * nodeInterval / 2;
          for (let i = 0, len = node.children.length; i < len; i++) {
            let x = start + i * nodeInterval;
            translateTree(node.children[i], x);
            layoutChild(node.children[i]);
          }
        }
      }
      const isOverlaps = (node1, node2) => {
        return (node1.x - node2.x) > 0 || (node2.x - node1.x) < nodeInterval;
      }
      treeLayout()
      
      const nodes = treesToArray([root])
      // 将计算得到的位置信息更新到原始节点数组中
      nodes.forEach(calculatedNode => {
        // 找到对应的实际节点数据在原始节点数组中的索引
        const index = self.nodes.findIndex(node => node.id === calculatedNode.id);

        // 如果找到了对应的节点，则更新其位置信息
        if (index !== -1) {
          self.nodes[index].x = calculatedNode.x;
          self.nodes[index].y = calculatedNode.y;
        }
      });

    },
  });
  graph.data(data);
  graph.render();
}