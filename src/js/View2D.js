import Matter from 'matter-js';

export default function View2D(el, plants) {
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
        width: 800,
        height: 600,
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
            console.log(plant);
            const { pos, type, count } = plant;
            const { x, y } = pos;
            const { r, color, sprite } = type;
            console.log(color);
            for (let i = 0; i < count; i += 1) {
              const c = Composite.create({
                  bodies: [Bodies.circle(x + i, y + i, r, {
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
                    friction: .09,
                    restitution: .15,
                    // isStatic: true
                  })]
              });
              plantBodies.push(c);
            }
        });
        return plantBodies;
    };
    var plantBodies = getPlantBodies(plants);
    World.add(world, plantBodies);

    World.add(world, [
        // walls
        Bodies.rectangle(400, -51, 800, 100, { isStatic: true }),
        Bodies.rectangle(400, 651, 800, 100, { isStatic: true }),
        Bodies.rectangle(-51, 300, 100, 600, { isStatic: true }),
        Bodies.rectangle(851, 300, 100, 600, { isStatic: true })
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
        max: { x: 800, y: 600 }
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
