import Matter from 'matter-js';

export default function View2D(el, width, height, plants) {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Composite = Matter.Composite,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create();
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

    // add plants
    function getPlantBodies(plants) {
        const plantBodies = [];
        plants.forEach((plant) => {
            const { pos, type } = plant;
            const { r, color } = type;
            const bodies = [];
            pos.forEach(item => {
              const { x, y } = item;
              bodies.push(Bodies.circle(x, y, r, {
                render: {
                  fillStyle: color,
                  // strokeStyle: '#ffffff',
                  strokeStyle: color,
                  lineWidth: 4,
                  opacity: 0.6
                  // sprite: {
                  //     texture: sprite
                  // }
                },
                friction: .9,
                restitution: .15,
                // isStatic: true
              }));
            });
            const c = Composite.create({
                bodies: bodies
            });
            plant.composite = c;
            // Add to list to add to world
            plantBodies.push(c);
        });
        return plantBodies;
    };
    var plantBodies = getPlantBodies(plants);
    World.add(world, plantBodies);

    World.add(world, [
        // walls
        Bodies.rectangle(width/2, -51, width, 100, { isStatic: true }),
        Bodies.rectangle(width/2, height + 51, width, 100, { isStatic: true }),
        Bodies.rectangle(-51, height/2, 100, height, { isStatic: true }),
        Bodies.rectangle(width + 51, height/2, 100, height, { isStatic: true })
    ]);

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
        plantBodies: plantBodies,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        },
        clearPlants: function() {
            World.remove(world, this.plantBodies);
            this.plantBodies = [];
        },
        addPlants: function(plants) {
            const plantBodies = getPlantBodies(plants);
            World.add(world, plantBodies);
            this.plantBodies.push(...plantBodies);
        }
    };
};
