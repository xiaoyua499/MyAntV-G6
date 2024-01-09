import G6 from "@antv/g6";

export function renderData(graph, data) {

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
      const nodes = []
      console.log(self);
      let layoutOrder = -1
      G6.Util.traverseTree(data.nodes[0], (subTree, parent, index) => {
        layoutOrder++
        console.log(subTree, parent, index, 23);
        subTree.style = {}
        subTree.layoutOrder = layoutOrder
        subTree.type = "circle"
        subTree.x = (index + 1) * 200
        if (parent) {
          subTree.y = Math.floor(parent.y) + 200
        } else {
          subTree.y = (index + 1) * 200
        }
        nodes.push(subTree)
        return true;
      });
      self.nodes = nodes;
      self.edges = data.edges;
      
    },
    /**
     * 执行布局
     */
    execute() {
      const self = this;

      
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
    // updateCfg(cfg) {
    //   const self = this;
    //   Util.mix(self, cfg);
    // },
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


  graph.data(data);
  graph.render();
}