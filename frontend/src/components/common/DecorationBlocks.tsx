import React, { useState, useEffect, useMemo } from 'react';

interface DecorationBlocksProps {
  count?: number;
  containerClassName?: string;
  fadeOnScroll?: boolean;
}

/**
 * 装饰方块组件
 * 用于页面的背景装饰元素，可以随滚动淡出
 */
const DecorationBlocks: React.FC<DecorationBlocksProps> = ({ 
  count = 8,
  containerClassName = "",
  fadeOnScroll = false
}) => {
  const [opacity, setOpacity] = useState(1);
  
  // 监听滚动事件，用于淡出效果
  useEffect(() => {
    if (!fadeOnScroll) return;
    
    const handleScroll = () => {
      // 当滚动超过200px时开始淡出，在500px时完全消失
      const scrollY = window.scrollY;
      const newOpacity = Math.max(0, 1 - scrollY / 500);
      setOpacity(newOpacity);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fadeOnScroll]);
  
  const colors = [
    'bg-gradient-to-br from-indigo-300 to-indigo-400',
    'bg-gradient-to-br from-purple-300 to-purple-400',
    'bg-gradient-to-br from-blue-300 to-blue-400',
    'bg-gradient-to-br from-pink-300 to-pink-400',
    'bg-gradient-to-br from-green-300 to-green-400',
    'bg-gradient-to-br from-red-300 to-red-400',
    'bg-gradient-to-br from-orange-300 to-orange-400'
  ];
  
  const faces = [':)', ':|', ';)', ':D', ':3', '^^', ':-)', ':P', ':-D', ':-P', ':-O'];
  
  // 使用useMemo缓存生成的方块，只在count变化时重新生成
  const blocks = useMemo(() => {
    // 为了确保每次组件挂载时方块位置一致，使用固定种子生成随机值
    const generateRandomWithSeed = (index: number, max: number) => {
      // 简单的伪随机数生成，使用index作为种子
      const seed = Math.sin(index * 9999) * 10000;
      return Math.floor((seed - Math.floor(seed)) * max);
    };
    
    return Array.from({length: count}, (_, i) => {
      const colorIndex = generateRandomWithSeed(i, colors.length);
      const randomColor = colors[colorIndex];
      
      const hasFace = generateRandomWithSeed(i + 100, 10) > 6;
      const faceIndex = generateRandomWithSeed(i + 200, faces.length);
      const face = hasFace ? faces[faceIndex] : '';
      
      const top = 10 + generateRandomWithSeed(i + 300, 60);
      const left = 5 + generateRandomWithSeed(i + 400, 90);
      const rotation = generateRandomWithSeed(i + 500, 20) - 10;
      
      return (
        <div 
          key={i}
          className={`absolute ${randomColor} w-12 h-12 rounded-lg shadow-md opacity-80 flex items-center justify-center text-lg font-bold text-white ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slower'}`}
          style={{
            top: `${top}%`,
            left: `${left}%`,
            transform: `rotate(${rotation}deg)`,
            zIndex: 0
          }}
        >
          {face}
        </div>
      );
    });
  }, [count, colors, faces]); // 只在count或颜色/表情数组变化时重新计算
  
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${containerClassName}`}
      style={{ opacity }}
    >
      {blocks}
    </div>
  );
};

export default DecorationBlocks; 