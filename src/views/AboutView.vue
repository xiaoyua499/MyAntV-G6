<template>
  <div ref="container" style="width: 800px; height: 600px;"></div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  data() {
    return {
      data: {
        nodes: [
          {
            id: '1',
            name: "总部",
            parentId: null,
            children: [
              {
                id: '2',
                name: "部门A",
                parentId: '1',
                children: [
                  {
                    id: '4',
                    name: "小组A1",
                    parentId: '2'
                  },
                  {
                    id: '5',
                    name: "小组A2",
                    parentId: '2'
                  }
                ]
              },
              {
                id: '3',
                name: "部门B",
                parentId: '1',
                children: [
                  {
                    id: '6',
                    name: "小组B1",
                    parentId: '3'
                  },
                  {
                    id: '7',
                    name: "小组B2",
                    parentId: '3'
                  }
                ]
              }
            ]
          }
        ],
        edges: [
          {
            source: '0',
            target: '6',
          },
          {
            source: '0',
            target: '7',
          },
          {
            source: '0',
            target: '9',
          },
          {
            source: '1',
            target: '6',
          },
          {
            source: '1',
            target: '9',
          },
          {
            source: '1',
            target: '7',
          },
          {
            source: '2',
            target: '8',
          },
          {
            source: '2',
            target: '9',
          },
          {
            source: '2',
            target: '6',
          },
          {
            source: '3',
            target: '8',
          },
          {
            source: '4',
            target: '6',
          },
          {
            source: '4',
            target: '7',
          },
          {
            source: '5',
            target: '9',
          },
        ],
      },
      graph: null,
    };
  },
  methods: {

  },
  mounted() {
    this.graph = new G6.Graph({
      container: this.$refs.container,
      width: 800,
      height: 600,
      layout: {
        type: 'bigraph-layout',
        biSep: 300,
        nodeSep: 20,
        nodeSize: 20,
      },
      animate: true,
      defaultNode: {
        size: 20,
        style: {
          fill: '#C6E5FF',
          stroke: '#5B8FF9',
        },
      },
      defaultEdge: {
        size: 1,
        color: '#e2e2e2',
      },
      modes: {
        default: ['drag-canvas'],
      },
    });

    G6.registerLayout('bigraph-layout', {
      init(data) {
        const self = this;
        const newData = {
          nodes: data.nodes,
          edges: data.edges
        }
        const newDatas = getData(newData)
        self.nodes = newDatas.nodes;
        self.edges = newDatas.edges;
        function getData(data) {
          const processedData = convertDataToG6(data.nodes);
          process(processedData.nodes);
          return {
            nodes: processedData.nodes,
            edges: processedData.edges
          }
        }

        function process(data) {
          const parentCoordinates = {};

          data.forEach((item, index) => {
            if (item.parentId === null || item.parentId === 'null') {
              item.x = Math.floor(Math.random() * 100);
              item.y = Math.floor(Math.random() * 100);
            } else {
              item.x = parentCoordinates[item.parentId].x * index;
              item.y = parentCoordinates[item.parentId].y + 200;
            }

            parentCoordinates[item.id] = { x: item.x, y: item.y };
          });

          return data;
        }

        function convertDataToG6(data) {
          const nodes = [];
          const edges = [];

          function convert(data, parentId = null) {
            data.forEach(item => {
              const node = {
                id: `${item.id}`,
                label: item.name,
                parentId: `${item.parentId}`,
                size: 20,
                style: {
                  fill: '#C6E5FF',
                  stroke: '#5B8FF9',
                },
              };

              nodes.push(node);

              if (parentId !== null) {
                edges.push({
                  source: `${parentId}`,
                  target: `${item.id}`,
                });
              }

              if (item.children && item.children.length > 0) {
                convert(item.children, item.id);
              }
            });
          }

          convert(data);

          return {
            nodes,
            edges
          };
        }


      },
      execute() {
        const self = this;
        const center = self.center || [0, 0];
        const biSep = self.biSep || 100;
        const nodeSep = self.nodeSep || 20;
        const nodeSize = self.nodeSize || 20;
        const direction = self.direction || 'horizontal';
        console.log(self);

        let { nodes, edges } = self;

      },
      layout(data) {
        const self = this;
        self.init(data);
        self.execute();
      },
    });


    this.graph.data(this.data);
    this.graph.render();
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph.destroy();
    }
  },
};
</script>
