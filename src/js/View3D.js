import * as THREE from 'three';

/* global requestAnimationFrame */

/** Class responsible for drawing a 3D view of the model */
export default class View3D {
  constructor(container) {
    this.container = container;

    this.worldWidth = 800;
    this.worldHeight = 300;
    this.width = 1200;
    this.height = 300;

    // Setup Three.js scene, camera, and renderer
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 2000);
    this.camera.position.z = 650;
    this.camera.position.y = 100;
    this.camera.position.x = 400;
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    this.renderer.setClearColor( 0x000000, 0 );
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    this.plantDataMap = {};
    this.nextID = -1;
    this.animate();
  }

  update = (model) => {
    this.model = model;
    this.clearScene();
    this.addModelToScene(model);
    this.animate();
  }

  getNextID = () => {
    this.nextID += 1;
    return this.nextID;
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    // Update positions from 2D physics simulator
    this.updatePlantPositions();
    this.renderer.render(this.scene, this.camera);
  }

  updatePlantPositions = () => {
    if (!this.model) {
      return;
    }

    const { plants } = this.model;
    plants.forEach(plant => {
      const { composite } = plant;
      composite.bodies.forEach(body => {
        const id = body._ggID;
        const { x, y } = body.position;
        if (x === undefined || y === undefined) {
          return;
        }
        const plantData = this.plantDataMap[id];
        const { plantParts, pos } = plantData;
        const oldX = pos.x;
        const oldY = pos.y;
        const dx = x - oldX;
        const dy = y - oldY;
        pos.x = x;
        pos.y = y;

        plantParts.forEach(part => {
          part.position.x += dx;
          part.position.z += dy;
        });
      })
    });
  }

  clearScene = () => {
    this.scene.remove.apply(this.scene, this.scene.children);
  }

  /**
   * Add the objects in the model to the scene
   * @param {object} model - A list of plants and their locations
   */
  addModelToScene = model => {
    if (!model) {
      return;
    }

    this.addGround();

    const { plants } = model;
    plants.forEach(plant => {
      const { type, composite } = plant;
      const { r, color } = type;
      composite.bodies.forEach(body => {
        const { x, y } = body.position;
        const plantData = this.addPlant(x, y, r, color);
        const id = this.getNextID();
        body._ggID = id;
        this.plantDataMap[id] = plantData;
      })
    });
  }

  addPlant = (x, y, r, color) => {
    const trunkHeight = r/2;
    const trunk = this.addTrunk(x, y, trunkHeight, r);
    const foliage = this.addFoliage(x, y, trunkHeight, r, color);
    const plantParts = [trunk, foliage];
    return { plantParts, pos: { x, y} };
  }

  addTrunk = (x, y, trunkHeight, r) => {
    const trunkGeo = new THREE.CylinderGeometry(r/10, r/10, trunkHeight, 6);
    const trunkMat = new THREE.MeshBasicMaterial({ color: 0x49413E });
    const trunk = new THREE.Mesh( trunkGeo, trunkMat );
    trunk.position.x = x;
    trunk.position.y = trunkHeight/2;
    trunk.position.z = y;
    this.scene.add(trunk);
    return trunk;
  }

  addFoliage = (x, y, trunkHeight, r, color) => {
    const geometry = new THREE.SphereGeometry(r, 6, 6);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = x;
    sphere.position.y = trunkHeight + r - 5;
    sphere.position.z = y;
    this.scene.add(sphere);
    return sphere;
  }

  addGround = () => {
    const thickness = 40;
    const geometry = new THREE.BoxGeometry(this.worldWidth, thickness, this.worldHeight);
    const material = new THREE.MeshBasicMaterial( {color: 0x8785a2} );
    const ground = new THREE.Mesh( geometry, material );
    ground.position.x = this.worldWidth/2;
    ground.position.y = -thickness/2;
    ground.position.z = this.worldHeight/2;
    this.scene.add(ground);
  }
}
