class HolographicDisplay {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(this.renderer.domElement);
    
    // Hologram effect
    this.material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      emissive: 0x003300,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.85,
      wireframe: true
    });
    
    this.createTerminalMesh();
    this.animate();
  }

  createTerminalMesh() {
    const geometry = new THREE.TextGeometry('NEO-TERMINAL', {
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true
    });
    
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.z = -5;
    this.scene.add(this.mesh);
    
    // Add lights
    const pointLight = new THREE.PointLight(0x00ff00, 1, 100);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}