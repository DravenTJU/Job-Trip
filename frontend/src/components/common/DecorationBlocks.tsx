import React from 'react';

interface DecorationBlocksProps {
  count?: number;
}

/**
 * 装饰方块组件
 * 用于认证页面的背景装饰元素
 */
const DecorationBlocks: React.FC<DecorationBlocksProps> = ({ count = 8 }) => {
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
  
  const blocks = Array.from({length: count}, (_, i) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const hasFace = Math.random() > 0.6;
    const face = hasFace ? faces[Math.floor(Math.random() * faces.length)] : '';
    
    return (
      <div 
        key={i}
        className={`absolute ${randomColor} w-12 h-12 rounded-lg shadow-md opacity-80 flex items-center justify-center text-lg font-bold text-white ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slower'}`}
        style={{
          top: `${10 + Math.random() * 60}%`,
          left: `${5 + Math.random() * 90}%`,
          transform: `rotate(${Math.floor(Math.random() * 20) - 10}deg)`,
          zIndex: 0
        }}
      >
        {face}
      </div>
    );
  });
  
  return <div className="fixed inset-0 overflow-hidden pointer-events-none">{blocks}</div>;
};

export default DecorationBlocks; 