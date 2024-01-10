import G6 from "@antv/g6";
import { renderData, graphHighlight, clearAllStats } from '@/components/CustomNode/customNode.js'

export function renderLayout(graph, data) {
  const treeDataConvert = (data) => {
    // console.log(data, 123);
    const treeData = {}
    const nodes = []
    const edges = []
    let layer = 0
    function addLayerToTree(tree, layer = 0) {
      tree.layer = layer; // 添加层级字段

      if (tree.children) {
        tree.children.forEach(child => {
          addLayerToTree(child, layer + 1); // 递归调用，增加子节点的层级
        });
      }
    }
    addLayerToTree(data.nodes[0])
    G6.Util.traverseTree(data.nodes[0], (subTree, parent, index) => {
      let edge = {}
      if (parent) {
        edge = {
          source: parent.id,
          target: subTree.id,
        }
      }
      if (!subTree.hasOwnProperty('children')) {
        subTree.children = []
      }
      subTree.parent = parent
      if (Object.keys(edge).length !== 0) {
        edges.push(edge)
      }
      subTree.x = 0
      if (parent) {
        subTree.y = Math.floor(parent.y) + 200
      } else {
        subTree.y = (index + 1) * 200
      }
      subTree.type = "customNode"
      nodes.push(subTree)
      return true;
    });
    treeData.nodes = nodes
    treeData.edges = edges
    return treeData
  }
  const treeData = treeDataConvert(data)
  renderData(graph, data.nodes[0])
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
     * 初始化
     * @param {Object} data 数据
     */
    init(data) {
      const self = this;
      console.log(data);
      // const treeData = treeDataConvert(data)
      self.nodes = data.nodes;
      self.edges = data.edges;
      console.log('init', self);
    },
    /**
     * 执行布局
     */
    execute() {
      const self = this;
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
      const root = self.nodes[0]
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
        // console.log(node,x);
        let dx = x - node.x;
        node.x = x;
        node.ox=node.x
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
        // console.log(node.x);
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
      const patch = (node) => {
        if (node.x !== node.ox) {

          node.ox = node.x;
        }

        for (let i = 0; i < node.children.length; i++) {
          patch(node.children[i]);
        }
      }
      const update = () => {
        renderRequestCount++;

        renderCount++;
        // 异步更新
        requestAnimationFrame(() => {
          renderCount++;

          if (renderCount === renderRequestCount) {
            layout();
            patch(root);

            renderCount = renderRequestCount = 0;
          }
        });
      }
      treeLayout()
      console.log('execute');

    },
    /**
     * 根据传入的数据进行布局
     * @param {Object} data 数据
     */
    layout(data) {
      console.log('layout');
      // console.log(data.nodes[0]);
      // const self = this;
      // const treeData = treeDataConvert(data)
      // self.init();
      // self.execute();
    },
    /**
     * 更新布局配置，但不执行布局
     * @param {Object} cfg 需要更新的配置项
     */
    updateCfg(cfg) {
      console.log('updateCfg');

      const self = this;
      Util.mix(self, cfg);
    },
    /**
     * 销毁
     */
    destroy() {
      const self = this;
      self.positions = null;
      self.nodes = null;
      self.edges = null;
      self.destroyed = true;
    },
  });
  graph.data(treeData);
  graph.render();
}