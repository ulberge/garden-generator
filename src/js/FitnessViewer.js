
// Class to handle rendering the fitness calculations to a canvas
export default class FitnessViewer {
  constructor(displays, scale=1) {
    // List of displays to render to
    this.displays = displays;
    this.scale = scale;
  }

  // Clear all the fitness displays
  clear = () => {
    this.displays.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    })
  }

  // Render this individual's fitnessData to display #i
  render = (i, individual) => {
    const canvas = this.displays[i];
    const ctx = canvas.getContext('2d');

    ctx.globalAlpha = 0.9;

    // Make sure fitness has been calculated already before proceeding
    if (!individual || !individual.fitnessData || !individual.fitnessData.neighborPairs) {
      return;
    }

    this.drawNeighborContrast(ctx, individual);
    this.drawOverlappingPlants(ctx, individual);
    this.drawIllegalPlants(ctx, individual);
  }

  // Draw lines between neighbors as green for 3 contrast, yellow for 2 contrasts, red for 1, and pink for 0
  drawNeighborContrast = (ctx, individual) => {
    const neighborPairs = individual.fitnessData.neighborPairs;
    neighborPairs.forEach(pair => {
      const { p0, p1, contrast } = pair;
      if (contrast === undefined || contrast === null) {
        return;
      }

      const x0 = p0.pos.x;
      const y0 = p0.pos.y;
      const x1 = p1.pos.x;
      const y1 = p1.pos.y;

      ctx.beginPath();
      ctx.moveTo(x0 * this.scale, y0 * this.scale);
      ctx.lineTo(x1 * this.scale, y1 * this.scale);

      if (contrast === 3) {
        ctx.strokeStyle = '#00FF00';
      }
      if (contrast === 2) {
        ctx.strokeStyle = '#FFCC00';
      }
      if (contrast === 1) {
        ctx.strokeStyle = '#FF0000';
      }
      if (contrast === 0) {
        ctx.strokeStyle = '#FF2BEB';
      }
      ctx.lineWidth = 1 * this.scale;
      ctx.stroke();
    });
  }

  // Draw heavily overlapping pairs with a red outline of width equal to overlap
  drawOverlappingPlants = (ctx, individual) => {
    const neighborPairs = individual.fitnessData.neighborPairs;
    neighborPairs.forEach(pair => {
      const { p0, p1, overlap } = pair;

      if (overlap > 0) {
        let o0 = Math.max(0.01, (Math.min(overlap, p0.type.r)/10));
        this.drawPlantOutline(ctx, p0, '#FF0000', o0);
        let o1 = Math.max(0.01, (Math.min(overlap, p1.type.r)/10));
        this.drawPlantOutline(ctx, p1, '#FF0000', o1);
      }
    });
  }

  // Draw illegal plants as transparent red circle
  drawIllegalPlants = (ctx, individual) => {
    individual.phenotype.forEach(plant => {
      if (plant.isIllegal) {
        this.drawPlantFillCircle(ctx, plant, '#FF0000');
      }
    });
  }

  // Draw a circle outline for this plant with the given color and line width
  drawPlantOutline = (ctx, plant, color, lineWidth) => {
    // draw plant
    const { pos, type } = plant;
    const { r } = type;
    const { x, y } = pos;
    ctx.beginPath();
    ctx.arc(x * this.scale, y * this.scale, (r-lineWidth+1) * this.scale, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = lineWidth * this.scale;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // Draw a filled circle for this plant with the given color
  drawPlantFillCircle = (ctx, plant, color) => {
    const { pos, type } = plant;
    const { r } = type;
    const { x, y } = pos;
    ctx.beginPath();
    ctx.arc(x * this.scale, y * this.scale, r * this.scale, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }
}
