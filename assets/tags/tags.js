// 3D标签云效果
class TagCloud {
  constructor(container, tags, options = {}) {
    this.container = container;
    this.tags = tags;
    this.options = {
      radius: 200,
      speed: 0.5,
      font: 'Arial',
      minFont: 12,
      maxFont: 24,
      textColor: '#333',
      hoverColor: '#40e0d0',
      ...options
    };
    
    this.angle = 0;
    this.init();
  }
  
  init() {
    // 清空容器
    this.container.innerHTML = '';
    
    // 创建标签元素
    this.tagElements = this.tags.map((tag, i) => {
      const element = document.createElement('a');
      element.href = tag.url;
      element.className = 'tag-cloud-item';
      element.textContent = tag.name;
      element.dataset.count = tag.count;
      element.dataset.index = i;
      
      // 根据标签数量计算字体大小
      const fontSize = this.calculateFontSize(tag.count);
      element.style.fontSize = `${fontSize}px`;
      
      // 随机颜色
      const hue = (360 * i / this.tags.length);
      element.style.color = `hsl(${hue}, 70%, 50%)`;
      element.style.backgroundColor = `hsla(${hue}, 70%, 50%, 0.1)`;
      
      // 鼠标事件
      element.addEventListener('mouseenter', () => this.onHover(i));
      element.addEventListener('mouseleave', () => this.onLeave(i));
      
      this.container.appendChild(element);
      return element;
    });
    
    // 初始布局
    this.updateLayout();
    
    // 开始动画
    this.animate();
  }
  
  calculateFontSize(count) {
    const maxCount = Math.max(...this.tags.map(t => t.count));
    const minCount = Math.min(...this.tags.map(t => t.count));
    
    if (maxCount === minCount) return (this.options.minFont + this.options.maxFont) / 2;
    
    return this.options.minFont + 
           ((count - minCount) / (maxCount - minCount)) * 
           (this.options.maxFont - this.options.minFont);
  }
  
  updateLayout() {
    const centerX = this.container.offsetWidth / 2;
    const centerY = this.container.offsetHeight / 2;
    
    this.tagElements.forEach((element, i) => {
      const count = parseInt(element.dataset.count);
      const weight = count / Math.max(...this.tags.map(t => t.count));
      
      // 球面坐标
      const phi = Math.acos(-1 + (2 * i) / this.tagElements.length);
      const theta = Math.sqrt(this.tagElements.length * Math.PI) * phi + this.angle;
      
      const x = this.options.radius * Math.cos(theta) * Math.sin(phi) * weight;
      const y = this.options.radius * Math.sin(theta) * Math.sin(phi) * weight * 0.3;
      const z = this.options.radius * Math.cos(phi) * weight;
      
      // 透视变换
      const scale = 1 + (z / this.options.radius) * 0.5;
      const opacity = 0.3 + (1 - Math.abs(z) / this.options.radius) * 0.7;
      
      element.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
      element.style.opacity = opacity;
      element.style.zIndex = Math.round(z);
    });
  }
  
  onHover(index) {
    this.tagElements[index].style.transform += ' scale(1.2)';
    this.tagElements[index].style.zIndex = 1000;
    this.tagElements[index].style.color = this.options.hoverColor;
    this.options.speed *= 0.5; // 减速
  }
  
  onLeave(index) {
    this.options.speed *= 2; // 恢复速度
    this.updateLayout();
  }
  
  animate() {
    this.angle += 0.002 * this.options.speed;
    this.updateLayout();
    requestAnimationFrame(() => this.animate());
  }
}

// 初始化函数
function initTagCloud() {
  const container = document.getElementById('tag-cloud-canvas');
  if (!container) return;
  
  // 从页面获取标签数据
  const tagElements = document.querySelectorAll('.tag-cloud-data');
  const tags = Array.from(tagElements).map(el => ({
    name: el.textContent.split('(')[0].trim(),
    count: parseInt(el.textContent.match(/\((\d+)\)/)?.[1] || '1'),
    url: el.href
  }));
  
  if (tags.length === 0) return;
  
  // 创建标签云实例
  new TagCloud(container, tags, {
    radius: Math.min(window.innerWidth, window.innerHeight) * 0.3,
    speed: 0.3
  });
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initTagCloud);
window.addEventListener('load', initTagCloud);
window.addEventListener('resize', debounce(initTagCloud, 250));