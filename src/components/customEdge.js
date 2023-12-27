import G6 from "@antv/g6";

G6.registerEdge('line-with-arrow',{
  itemType:'edge',
  draw:function draw(cfg,group){
    cfg.style={
      endArrow:true
    },
    cfg.labelCfg={
      autoRotate:true,
      style:{
        stroke:'#fff',
        lineWidth:1
      }
    }
    var startPoint = cfg.startPoint
    var endPoint = cfg.endPoint
    var centerPoint = {
      x:(startPoint.x+endPoint.x)/2,
      y:startPoint.y
    }
    var controlPoint = {
      x: (startPoint.x + centerPoint.x) / 2,
      y: startPoint.y
    }
    var path = group.addShape('path',{
      attrs:{
        path:[['M',startPoint.x,startPoint.y],['Q',centerPoint.x+8,controlPoint.y,centerPoint.x,centerPoint.y],['T',endPoint.x-8,endPoint.y],['L',endPoint.x,endPoint.y]],
        stroke:'#ccc',
        lineWidth:1.6,
        fill:'#ccc',
        endArrow:{
          path:'M 4,0 L -4,-4 L -4,4 Z',
          d:4
        },
        startArrow:{
          
        }
      }
    })
    return path
  }
})