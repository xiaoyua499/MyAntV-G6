import G6 from "@antv/g6";
import { renderData, graphHighlight, clearAllStats } from '@/components/CustomNode/customNode.js'
// 节点类
class Node {
  // 存放节点数据
  constructor(data, parent, index, x, y) {
    this.data = data;
    this.parent = parent;
    this.index = index;
    this.x = x;
    this.y = y;
    this.ox = x;
    this.children = [];
  }
}

// 树的主类
class Tree {
  // 根节点
  constructor(node) {
    this.count = 0;

    this.nodeWidth = 120;
    this.nodeHeight = 120;
    this.nodeInterval = 100 + this.nodeWidth;
    this.yInterval = 60 + this.nodeHeight;

    this.rootX = 400;
    this.rootY = 80;

    this.hashTree = [];
    this.renderRequestCount = this.renderCount = 0;

    // 创建一个节点到根节点（createNode函数代码省略）
    this.root = node
  }

  layout() {
    this.hashTree = this.generateArraysByLevel(this.root)
    this.layoutChild(this.root);
    this.layoutOverlaps();
  }

  generateArraysByLevel(tree) {
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

  findCommonParentNode(node1, node2) {
    if (node1.parent === node2.parent) {
      return node2;
    } else {
      return this.findCommonParentNode(node1.parent, node2.parent);
    }
  }

  translateTree(node, x) {
    // console.log(node.label, x);
    let dx = x - node.x;
    node.x = x;

    for (let i = 0; i < node.children.length; i++) {
      this.translateTree(node.children[i], node.children[i].x + dx);
    }
  }

  layoutOverlaps() {
    for (let i = this.hashTree.length - 1; i >= 0; i--) {
      let curLayer = this.hashTree[i];
      for (let j = 0; j < curLayer.length - 1; j++) {
        let n1 = curLayer[j], n2 = curLayer[j + 1];
        if (this.isOverlaps(n1, n2)) {
          let dx = n1.x + this.nodeInterval - n2.x
          let node2Move = this.findCommonParentNode(n1, n2);

          this.translateTree(node2Move, node2Move.x + dx);
          this.centerChild(node2Move.parent);

          i = this.hashTree.length;
        }
      }
    }
  }

  centerChild(parent) {
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
        this.translateTree(parent.children[i], parent.children[i].x + dx);
      }
    }
  }

  layoutChild(node) {
    if (node.children.length === 0) return;
    else {
      let start = node.x - (node.children.length - 1) * this.nodeInterval / 2;

      for (let i = 0, len = node.children.length; i < len; i++) {
        let x = start + i * this.nodeInterval;

        this.translateTree(node.children[i], x);
        this.layoutChild(node.children[i]);
      }
    }
  }

  isOverlaps(node1, node2) {
    return (node1.x - node2.x) > 0 || (node2.x - node1.x) < this.nodeInterval;
  }

  patch(node) {
    if (node.x !== node.ox) {

      node.ox = node.x;
    }

    for (let i = 0; i < node.children.length; i++) {
      this.patch(node.children[i]);
    }
  }

  update() {
    this.renderRequestCount++;

    this.renderCount++;
    // 异步更新
    requestAnimationFrame(() => {
      this.renderCount++;

      if (this.renderCount === this.renderRequestCount) {
        this.layout();
        this.patch(this.root);

        this.renderCount = this.renderRequestCount = 0;
      }
    });
  }
}


export function renderLayout(graph, data) {

  const treeDataConvert = (data) => {

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
      subTree.x = (index + 1) * 200
      if (parent) {
        subTree.y = Math.floor(parent.y) + 200
      } else {
        subTree.y = (index + 1) * 200
      }
      edges.push(edge)
      nodes.push(subTree)
      return true;
    });
    treeData.nodes = nodes
    treeData.edges = edges
    return treeData
  }
  renderData(graph,data.nodes[0])
  G6.registerLayout('customTreeLayout', {
    /**
     * 定义自定义行为的默认参数，会与用户传入的参数进行合并
     */
    getDefaultCfg() {
      return {};
    },
    /**
     * 初始化
     * @param {Object} data 数据
     */
    init(data) {
      const self = this;
      self.nodes = data.nodes;
      self.edges = data.edges;

    },
    /**
     * 执行布局
     */
    execute() {
      const self = this;
      const tree = new Tree(self.nodes[0])
      tree.layout()
      console.log(self);
      // tree.update()
      // self.nodes = nodes
    },
    /**
     * 根据传入的数据进行布局
     * @param {Object} data 数据
     */
    layout(data) {
      const self = this;
      self.init(data);
      self.execute();
    },
    /**
     * 更新布局配置，但不执行布局
     * @param {Object} cfg 需要更新的配置项
     */
    updateCfg(cfg) {
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
  const treeData = treeDataConvert(data)

  graph.data(treeData);
  graph.render();
}