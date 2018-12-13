import Matter from 'matter-js';
import $ from 'jquery';
import decomp from 'poly-decomp';
window.decomp = decomp;

export default function PhysicsSimulator(el, width, height, plants, filter) {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Composite = Matter.Composite,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Svg = Matter.Svg,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create({
      enableSleeping: true
    });
    var world = engine.world;
    world.gravity.scale = 0;

    // create renderer
    var render = Render.create({
      element: el,
      engine: engine,
      options: {
        width: width,
        height: height,
        background: '#8785a2',
        wireframes: false,
        showAngleIndicator: false
      }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    var blockedCategory = 0x0001,
      shadeCategory = 0x0002,
      partShadeCategory = 0x0004,
      partSunCategory = 0x0008,
      sunCategory = 0x0010;

    function getFilterCategory(shade) {
      const minShade = shade[0];
      const maxShade = shade[1];

      // Add the categories that it should collide with
      let category = blockedCategory;
      if (minShade > 0) { // collide with shade
        category = category | shadeCategory;
      }
      if (minShade > 1 && maxShade < 1) { // collide with part shade
        category = category | partShadeCategory;
      }
      if (minShade > 2 && maxShade < 2) { // collide with part sun
        category = category | partSunCategory;
      }
      if (maxShade < 3) { // collide with sun
        category = category | sunCategory;
      }

      return category;
    }

    const getGlobalBodies = (filter) => {
      const size = 15;
      const widthSection = width/size;
      const heightSection = height/size;

      const bodies = [];
      for (let i = 0; i < size; i += 1) {
        for (let j = 0; j < size; j += 1) {
          const x = (i + 0.5) * widthSection;
          const y = (j + 0.5) * heightSection;
          const type = filter.getType({ x, y });

          const render = {
            fillStyle: '#FFFF00',
            opacity: (type + 1) * 0.2
          };

          let category;
          switch (type) {
            case -1:
              category = blockedCategory;
              break;
            case 0:
              category = shadeCategory;
              break;
            case 1:
              category = partShadeCategory;
              break;
            case 2:
              category = partSunCategory;
              break;
            case 3:
              category = sunCategory;
              break;
            default:
              category = blockedCategory;
              break;
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

    const globalBodies = getGlobalBodies(filter);
    World.add(world, globalBodies);

    // add plants
    function getPlantBodies(plants) {
        const plantBodies = [];

        // const patternCanvas = document.createElement('canvas');
        // patternCanvas.width = 20;
        // patternCanvas.height = 20;
        // const pctx = patternCanvas.getContext('2d');
        // pctx.fillRect(5, 5, 10, 10);
        // const pattern = pctx.createPattern(patternCanvas, 'repeat');

        plants.forEach((plant) => {
            const { pos, type, count } = plant;
            const { r, foliageColor } = type;
            const bodies = [];
            const minShade = type.shade[0];
            const maxShade = type.shade[1];
            for (let i = 0; i < count; i += 1) {
              const { x, y } = pos;
              const nextPlant = Bodies.circle(x + i, y + i, r, {
                render: {
                  fillStyle: foliageColor,
                  strokeStyle: foliageColor,
                  lineWidth: 2,
                  opacity: maxShade*0.3+0.1
                },
                collisionFilter: {
                    category: getFilterCategory(type.shade)
                },
                friction: 10,
                restitution: 1,
                timeScale: 10
              });
              // Add to offset the group
              bodies.push(nextPlant);
            }

            const c = Composite.create({
                bodies: bodies
            });
            // if (bodies.length > 1) {
            //   Composites.chain(c, 0.5, 0, -0.5, 0, { stiffness: 1, render: { visible: false } });
            // }
            plant.composite = c;
            // Add to list to add to world
            plantBodies.push(c);
        });
        return plantBodies;
    };
    var plantBodies = getPlantBodies(plants);
    World.add(world, plantBodies);

    const wallWidth = 1000;
    World.add(world, [
        // walls
        Bodies.rectangle(width/2, -(wallWidth/2) - 1, width, wallWidth, { isStatic: true }),
        Bodies.rectangle(width/2, height + (wallWidth/2) + 1, width, wallWidth, { isStatic: true }),
        Bodies.rectangle(-(wallWidth/2) - 1, height/2, wallWidth, height, { isStatic: true }),
        Bodies.rectangle(width + (wallWidth/2) + 1, height/2, wallWidth, height, { isStatic: true })
    ]);

    // const dougFirColor_partsun = '#000';
    // const dougFirOptions_partsun = {
    //   render: {
    //     fillStyle: dougFirColor_partsun,
    //     strokeStyle: dougFirColor_partsun,
    //     lineWidth: 0,
    //     opacity: 0.2
    //   },
    //   isStatic: true,
    //   collisionFilter: {
    //       mask: partSunCategory
    //   }
    // };
    // World.add(world, [
    //     // walls
    //     Bodies.circle(23, 19+30, 35+7, dougFirOptions_partsun),
    //     Bodies.circle(80, 8+30, 35+7, dougFirOptions_partsun),
    //     Bodies.circle(233, 9+30, 50+10, dougFirOptions_partsun),
    // ]);

    // const dougFirColor_partshade = '#000';
    // const dougFirOptions_partshade = {
    //   render: {
    //     fillStyle: dougFirColor_partshade,
    //     strokeStyle: dougFirColor_partshade,
    //     lineWidth: 0,
    //     opacity: 0.4
    //   },
    //   isStatic: true,
    //   collisionFilter: {
    //       mask: partShadeCategory
    //   }
    // };
    // World.add(world, [
    //     // walls
    //     Bodies.circle(23, 19+15, 35+3, dougFirOptions_partshade),
    //     Bodies.circle(80, 8+15, 35+3, dougFirOptions_partshade),
    //     Bodies.circle(233, 9+15, 50+5, dougFirOptions_partshade),
    // ]);

    // const dougFirColor_shade = '#000';
    // const dougFirOptions_shade = {
    //   render: {
    //     fillStyle: dougFirColor_shade,
    //     strokeStyle: dougFirColor_shade,
    //     lineWidth: 0,
    //     opacity: 0.6
    //   },
    //   isStatic: true,
    //   collisionFilter: {
    //       mask: shadeCategory
    //   }
    // };
    // World.add(world, [
    //     // walls
    //     Bodies.circle(23, 19, 35-7, dougFirOptions_shade),
    //     Bodies.circle(80, 8, 35-7, dougFirOptions_shade),
    //     Bodies.circle(233, 9, 50-10, dougFirOptions_shade),
    // ]);

    const dougFirColor = '#000';
    const dougFirOptions = {
      render: {
        fillStyle: dougFirColor,
        strokeStyle: dougFirColor,
        lineWidth: 0,
        opacity: 1
      },
      isStatic: true,
      collisionFilter: {
          mask: blockedCategory
      }
    };
    World.add(world, [
        // walls
        Bodies.circle(23, 19, 10, dougFirOptions),
        Bodies.circle(80, 8, 10, dougFirOptions),
        Bodies.circle(233, 9, 15, dougFirOptions),
    ]);

    // const dogwoodColor_partsun = '#000';
    // const dogwoodOptions_partsun = {
    //   render: {
    //     fillStyle: dogwoodColor_partsun,
    //     strokeStyle: dogwoodColor_partsun,
    //     lineWidth: 0,
    //     opacity: 0.2
    //   },
    //   isStatic: true,
    //   collisionFilter: {
    //       mask: partSunCategory
    //   }
    // };
    // World.add(world, [
    //     // walls
    //     Bodies.circle(61, 60+20, 29+5, dogwoodOptions_partsun),
    //     Bodies.circle(230, 68+20, 27+5, dogwoodOptions_partsun)
    // ]);

    // const dogwoodColor_partshade = '#000';
    // const dogwoodOptions_partshade = {
    //   render: {
    //     fillStyle: dogwoodColor_partshade,
    //     strokeStyle: dogwoodColor_partshade,
    //     lineWidth: 0,
    //     opacity: 0.4
    //   },
    //   isStatic: true,
    //   collisionFilter: {
    //       mask: partShadeCategory
    //   }
    // };
    // World.add(world, [
    //     // walls
    //     Bodies.circle(61, 60+10, 29, dogwoodOptions_partshade),
    //     Bodies.circle(230, 68+10, 27, dogwoodOptions_partshade)
    // ]);

    // const dogwoodColor_shade = '#000';
    // const dogwoodOptions_shade = {
    //   render: {
    //     fillStyle: dogwoodColor_shade,
    //     strokeStyle: dogwoodColor_shade,
    //     lineWidth: 0,
    //     opacity: 0.6
    //   },
    //   collisionFilter: {
    //       mask: shadeCategory
    //   },
    //   isStatic: true
    // };
    // World.add(world, [
    //     // walls
    //     Bodies.circle(61, 60, 29-7, dogwoodOptions_shade),
    //     Bodies.circle(230, 68, 27-7, dogwoodOptions_shade)
    // ]);

    const dogwoodColor = '#000';
    const dogwoodOptions = {
      render: {
        fillStyle: dogwoodColor,
        strokeStyle: dogwoodColor,
        lineWidth: 0,
        opacity: 1
      },
      isStatic: true,
      collisionFilter: {
          mask: blockedCategory
      }
    };
    World.add(world, [
        // walls
        Bodies.circle(61, 60, 6, dogwoodOptions),
        Bodies.circle(230, 68, 6, dogwoodOptions)
    ]);

    // let vertices = Matter.Vertices.fromPath('0 423 78 154 143 71 229 26 328 0 455 7 508 49 578 135 672 423');
    // Matter.Vertices.scale(vertices, 0.25, 0.25, {x:0, y:0});
    // const grass = Bodies.fromVertices(110, 150, vertices, {
    // //const grass = Bodies.fromVertices(420, 0, vertices, {
    //   render: {
    //       fillStyle: '#000',
    //       strokeStyle: '#000',
    //       lineWidth: 0,
    //       opacity: 1
    //   },
    //   isStatic: true,
    //   collisionFilter: {
    //       mask: blockedCategory
    //   }
    // });
    // World.add(world, grass);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        plants: plants,
        plantBodies: plantBodies,
        ready: false,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        },
        clearPlants: function() {
            World.remove(world, this.plantBodies);
            this.plantBodies = [];
            this.plants = [];
        },
        addPlants: function(plants) {
            this.ready = false;
            const plantBodies = getPlantBodies(plants);
            World.add(world, plantBodies);
            this.plantBodies.push(...plantBodies);
            this.plants.push(...plants);
            setTimeout(() => {
              this.ready = true;
            }, 4000);
        },
        isWorldSleeping: function() {
          // if (this.ready) {
          //   const bodies = Composite.allBodies(world);
          //   bodies.forEach((body) => body.isStatic = true);
          //   return true;
          // }

          const bodies = Composite.allBodies(world);
          const sleeping = bodies.filter((body) => body.isSleeping);
          const isWorldSleeping = bodies.length === sleeping.length;
          return isWorldSleeping;
        },
        getPhenotype: function() {
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
    };
};
