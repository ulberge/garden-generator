import Matter from 'matter-js';
import decomp from 'poly-decomp';

import SitePlan from './SitePlan';

const { Bodies, Render, World, Engine, Runner, Vertices, Composite } = Matter;

window.decomp = decomp;

/************************************************************
*
* PhysicsSimulator.js
* By: Erik Ulberg
*
* Class to handle calculating and rendering the transformation from genotype to phenotype
*
*************************************************************/
export default class PhysicsSimulator{
  constructor(el, width, height, filter) {
    this.el = el;
    this.width = width;
    this.height = height;
    this.filter = filter;
    this.plantBodies = [];
    this.plants = [];

    this.ready = false;
    // Max time before stopping waiting for sleep
    this.maxRunTime = 20000;
    // The resolution of the sun light blocks in the simulation
    this.lightAccuracy = 15;

    // Categories to filter collisions with boundaries and sunlight levels
    this.blockedCategory = 0x0001;
    this.shadeCategory = 0x0002;
    this.partShadeCategory = 0x0004;
    this.partSunCategory = 0x0008;
    this.sunCategory = 0x0010;

    // Setup MatterJS
    // Create engine
    this.engine = Engine.create({
      enableSleeping: true
    });
    this.world = this.engine.world;
    this.world.gravity.scale = 0;

    // Create renderer
    this.render = Render.create({
      element: el,
      engine: this.engine,
      options: {
        width: this.width,
        height: this.height,
        background: '#8785a2',
        wireframes: false,
        showAngleIndicator: false
      }
    });

    Render.run(this.render);

    // Create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);

    this.addGlobalObjects();

    // Fit the render viewport to the scene
    Render.lookAt(this.render, {
        min: { x: 0, y: 0 },
        max: { x: this.width, y: this.height }
    });
  }

  // Add the site map objects (sunlight/shade, outer boundaries, hard scapes, and tree trunks)
  addGlobalObjects = () => {
    // Add sunlight objects
    const sunLight = this.getSunBodies(this.filter);
    World.add(this.world, sunLight);

    const blockedOptions = {
      render: {
        fillStyle: '#000',
      },
      isStatic: true,
      collisionFilter: {
          mask: this.blockedCategory
      }
    };

    // Add walls
    const wallWidth = 1000;
    World.add(this.world, [
        Bodies.rectangle(this.width/2, -(wallWidth/2) - 1, this.width, wallWidth, blockedOptions),
        Bodies.rectangle(this.width/2, this.height + (wallWidth/2) + 1, this.width, wallWidth, blockedOptions),
        Bodies.rectangle(-(wallWidth/2) - 1, this.height/2, wallWidth, this.height, blockedOptions),
        Bodies.rectangle(this.width + (wallWidth/2) + 1, this.height/2, wallWidth, this.height, blockedOptions)
    ]);

    // Add trees
    const treeBodies = SitePlan.trees.map(tree => Bodies.circle(tree[0], tree[1], tree[2], blockedOptions));
    World.add(this.world, treeBodies);

    // Add svg areas
    SitePlan.svg.forEach(b => {
      let vertices = Vertices.fromPath(b[0]);
      Vertices.scale(vertices, b[1], b[1], {x:0, y:0});
      const body = Bodies.fromVertices(b[2], b[3], vertices, blockedOptions);
      World.add(this.world, body);
    });
  }

  // Stop the simulation from running
  stop = () => {
    Render.stop(this.render);
    Runner.stop(this.runner);
  }

  // Clear the plants from the world
  clearPlants = () => {
    World.remove(this.world, this.plantBodies);
    this.plantBodies = [];
    this.plants = [];
  }

  // Add more plants to the world
  addPlants = (plants) => {
    this.ready = false;
    const plantBodies = this.getPlantBodies(plants);
    World.add(this.world, plantBodies);
    this.plantBodies.push(...plantBodies);
    this.plants.push(...plants);
    setTimeout(() => {
      this.ready = true;
    }, this.maxRunTime);
  }

  // Return true if all the objects in the world have stopped moving, or true if they have been moving for the max time
  isWorldSleeping = () => {
    if (this.ready) {
      const bodies = Composite.allBodies(this.world);
      bodies.forEach((body) => body.isStatic = true);
      return true;
    }

    const bodies = Composite.allBodies(this.world);
    const sleeping = bodies.filter((body) => body.isSleeping);
    const isWorldSleeping = bodies.length === sleeping.length;
    return isWorldSleeping;
  }

  // Retrieve the current state of all the plant objects based on the simulation, also referred to as the "phenotype"
  getPhenotype = () => {
    const settledPlants = [];

    for (let i = 0; i < this.plants.length; i++) {
      const composites = this.plantBodies[i];
      const plant = this.plants[i];
      if (!composites) {
        console.log('bad');
        return [];
      }

      const { bodies } = composites;
      bodies.forEach(body => {
        const { position } = body;
        const settledPlant = {};
        settledPlant.type = plant.type;
        settledPlant.pos = position;
        settledPlants.push(settledPlant);
      })
    }
    // return a list of plants with their positions
    return settledPlants;
  }

  // Given a shade min/max array, return the filter category for this object
  getFilterCategory = (shade) => {
    const minShade = shade[0];
    const maxShade = shade[1];

    // Add the categories that it should collide with
    let category = this.blockedCategory;
    if (minShade > 0) { // collide with shade
      category = category | this.shadeCategory;
    }
    if (minShade > 1 && maxShade < 1) { // collide with part shade
      category = category | this.partShadeCategory;
    }
    if (minShade > 2 && maxShade < 2) { // collide with part sun
      category = category | this.partSunCategory;
    }
    if (maxShade < 3) { // collide with sun
      category = category | this.sunCategory;
    }

    return category;
  }

  // Get all the bodies that represent the different levels of sunlight
  getSunBodies = (filter) => {
    const size = this.lightAccuracy;
    const widthSection = this.width/size;
    const heightSection = this.height/size;

    const bodies = [];
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        const x = (i + 0.5) * widthSection;
        const y = (j + 0.5) * heightSection;
        const type = filter.getType({ x, y });

        const render = {
          fillStyle: '#FDECA3',
          opacity: (type + 1) * 0.2
        };

        let category;
        switch (type) {
          case -1:
            category = this.blockedCategory;
            render.fillStyle = '#000';
            render.opacity = 1;
            break;
          case 0:
            category = this.shadeCategory;
            break;
          case 1:
            category = this.partShadeCategory;
            break;
          case 2:
            category = this.partSunCategory;
            break;
          case 3:
            category = this.sunCategory;
            break;
          default:
            category = this.blockedCategory;
            break;
        }

        // Do not include the blocked category from the filter, those are included by hand for efficiency
        if (category === this.blockedCategory) {
          continue;
        }

        bodies.push(Bodies.rectangle(x, y, widthSection, heightSection, {
          isStatic: true,
          render: render,
          collisionFilter: {
            mask: category
          }
        }));
      }
    }
    return bodies;
  }

  // Get all the plant bodies based on the plant list (genotype)
  getPlantBodies = (plants) => {
    const plantBodies = [];

    plants.forEach((plant) => {
      const { pos, type, count } = plant;
      const { r, foliageColor } = type;
      const bodies = [];
      const maxShade = type.shade[1];
      for (let i = 0; i < count; i += 1) {
        const { x, y } = pos;
        const nextPlant = Bodies.circle(x + (Math.random()*10*i), y + (Math.random()*10*i), r, {
          render: {
            fillStyle: foliageColor === 'green' ? '#8D975B' : '#577155',
            strokeStyle: foliageColor === 'green' ? '#8D975B' : '#577155',
            lineWidth: 2,
            opacity: maxShade*0.3+0.1
          },
          collisionFilter: {
              category: this.getFilterCategory(type.shade)
          },
          friction: 1
        });
        // Add to offset the group
        bodies.push(nextPlant);
      }

      const c = Composite.create({
          bodies: bodies
      });
      plant.composite = c;
      // Add to list to add to world
      plantBodies.push(c);
    });
    return plantBodies;
  }
};
