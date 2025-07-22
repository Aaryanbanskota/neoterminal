export class MatrixEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.chars = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｿﾕﾗｽﾔﾇﾁﾈｷｶﾑﾏｾﾛｭｱｹﾒｴｶｰｸｩｺｪﾄﾟ";
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    setInterval(() => this.draw(), 33);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(1);
  }

  draw() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    this.drops.forEach((y, i) => {
      const text = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      
      this.ctx.fillText(text, x, y * this.fontSize);
      
      if (y * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    });
  }
}