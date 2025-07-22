export class NeonGlow {
  static apply(element, color = '#0ff', intensity = 0.8) {
    element.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;
    element.style.textShadow = `0 0 5px ${color}`;
    
    const animation = `
      @keyframes neon-pulse {
        0% { opacity: ${intensity * 0.7}; }
        50% { opacity: ${intensity}; }
        100% { opacity: ${intensity * 0.7}; }
      }
    `;
    
    const style = document.createElement('style');
    style.innerHTML = animation;
    document.head.appendChild(style);
    
    element.style.animation = 'neon-pulse 2s infinite';
  }

  static createPulse(x, y, color = '#f0f') {
    const pulse = document.createElement('div');
    pulse.style.position = 'fixed';
    pulse.style.left = `${x}px`;
    pulse.style.top = `${y}px`;
    pulse.style.width = '0';
    pulse.style.height = '0';
    pulse.style.borderRadius = '50%';
    pulse.style.backgroundColor = color;
    pulse.style.transform = 'translate(-50%, -50%)';
    pulse.style.pointerEvents = 'none';
    
    document.body.appendChild(pulse);
    
    const animation = pulse.animate([
      { width: '0', height: '0', opacity: 0.8 },
      { width: '200px', height: '200px', opacity: 0 }
    ], { duration: 1000 });
    
    animation.onfinish = () => pulse.remove();
  }
}