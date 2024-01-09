/**
 * 检测两个圆形是否相交
 * @param {object} circle1 - 第一个圆形对象，包含属性 x, y, radius
 * @param {object} circle2 - 第二个圆形对象，包含属性 x, y, radius
 * @returns {boolean} - 返回布尔值表示是否相交
 */
export function circlesIntersect(circle1, circle2) {
  // 计算两个圆心之间的距离
  const distance = Math.sqrt(Math.pow(circle2.x - circle1.x, 2) + Math.pow(circle2.y - circle1.y, 2));
  // 计算两个圆半径之和
  const minDistance = circle1.radius + circle2.radius;
  // 如果两个圆心之间的距离小于两个半径之和，则认为相交
  return distance < minDistance;
}

/**
 * 避免圆形相交并重叠
 * @param {object} circle1 - 第一个圆形对象，包含属性 x, y, radius
 * @param {object} circle2 - 第二个圆形对象，包含属性 x, y, radius
 */
export function avoidCircleCollision(circle1, circle2) {
  // 计算两个圆心之间的角度
  const angle = Math.atan2(circle2.y - circle1.y, circle2.x - circle1.x);
  // 将第二个圆移到不相交的位置
  circle2.x = circle1.x + Math.cos(angle) * (circle1.radius + circle2.radius + 1);
  circle2.y = circle1.y + Math.sin(angle) * (circle1.radius + circle2.radius + 1);
}
/**
 * 检测圆形数组中的碰撞并返回更新后的数组
 * @param {array} circles - 包含圆形对象的数组
 * @returns {array} - 返回更新后的圆形数组
 */
export function detectCollisions(circles) {
  for (let i = 0; i < circles.length; i++) {
    for (let j = 0; j < circles.length; j++) {
      if (i !== j && circlesIntersect(circles[i], circles[j])) {
        avoidCircleCollision(circles[i], circles[j]);
      }
    }
  }
  return circles;
}