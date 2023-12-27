<template>
  <div>
    <!-- 画布 -->
    <canvas ref="canvas" @mousedown="startDrag" @mousemove="dragCircle" @mouseup="endDrag"></canvas>
  </div>
</template>

<script>
import {circlesIntersect,avoidCircleCollision,detectCollisions} from './collisionDetection.js'
export default {
  data() {
    return {
      // 存储圆形的数组
      circles: [],
      // 当前被选中的圆形索引
      selectedCircleIndex: -1,
      // 画布及上下文
      canvas: null,
      ctx: null,
      // 画布尺寸
      canvasWidth: 800,
      canvasHeight: 600,
      // 拖动偏移量
      dragOffsetX: 0,
      dragOffsetY: 0,
    };
  },
  mounted() {
    // 初始化画布和圆形
    this.initializeCanvas();
    this.initializeCircles();
    this.drawCircles();
  },
  methods: {
    initializeCanvas() {
      // 获取画布和上下文
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext('2d');
      // 设置画布尺寸
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
    },

    initializeCircles() {
      // 创建圆形并添加到数组中
      const numberOfCircles = 20;
      const diameter = 100;
      const radius = diameter / 2;
      for (let i = 0; i < numberOfCircles; i++) {
        const circle = {
          x: Math.random() * (this.canvasWidth - diameter) + radius,
          y: Math.random() * (this.canvasHeight - diameter) + radius,
          radius: radius,
        };
        this.circles.push(circle);
      }
    },

    drawCircles() {
      // 绘制所有圆形
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const circles=detectCollisions(this.circles)
      for (let i = 0; i < circles.length; i++) {
        this.drawCircle(circles[i]);
      }
    },

    drawCircle(circle) {
      // 绘制单个圆形
      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
      this.ctx.fill();
      this.ctx.closePath();
    },

    startDrag(event) {
      // 处理拖动开始事件
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // 寻找被点击的圆形
      for (let i = this.circles.length - 1; i >= 0; i--) {
        const circle = this.circles[i];
        const dx = mouseX - circle.x;
        const dy = mouseY - circle.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared <= circle.radius * circle.radius) {
          this.selectedCircleIndex = i;
          this.dragOffsetX = dx;
          this.dragOffsetY = dy;
          break;
        }
      }
    },

    dragCircle(event) {
      // 处理拖动圆形事件
      if (this.selectedCircleIndex !== -1) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // 更新选中圆形的位置
        this.circles[this.selectedCircleIndex].x = mouseX - this.dragOffsetX;
        this.circles[this.selectedCircleIndex].y = mouseY - this.dragOffsetY;

        this.checkCollisionsAndRedraw();
      }
    },

    endDrag() {
      // 结束拖动事件
      this.checkCollisionsAndRedraw();
      this.selectedCircleIndex = -1;
    },

    checkCollisionsAndRedraw() {
      // 检测碰撞并重绘
      for (let i = 0; i < this.circles.length; i++) {
        for (let j = 0; j < this.circles.length; j++) {
          if (i !== j && circlesIntersect(this.circles[i], this.circles[j])) {
            avoidCircleCollision(this.circles[i], this.circles[j]);
          }
        }
      }
      this.drawCircles();
    },
  },
};
</script>

<style>
canvas {
  border: 1px solid black;
}
</style>
