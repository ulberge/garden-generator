
export default class FitnessViewer {
  constructor(displays, scale=1) {
    this.displays = displays;
    this.scale = scale;
  }

  clear = () => {
    this.displays.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    })
  }

  render = (i, individual) => {
    const canvas = this.displays[i];
    const ctx = canvas.getContext('2d');

    ctx.globalAlpha = 0.9;

    const neighborPairs = individual.fitnessData.neighborPairs;
    neighborPairs.forEach(pair => {
      const { p0, p1, contrast } = pair;
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

    neighborPairs.forEach(pair => {
      const { p0, p1, overlap } = pair;

      if (overlap > 0) {
        let o0 = Math.max(0.01, (Math.min(overlap, p0.type.r)/10));
        this.drawPlantOutline(ctx, p0, '#FF0000', o0);
        let o1 = Math.max(0.01, (Math.min(overlap, p1.type.r)/10));
        this.drawPlantOutline(ctx, p1, '#FF0000', o1);
      }
    });

    // draw illegal plants as red
    individual.phenotype.forEach(plant => {
      if (plant.isIllegal) {
        this.drawPlantFillCircle(ctx, plant, '#FF0000');
      }
    });
  }

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

  drawPlantFillCircle = (ctx, plant, color) => {
    // draw plant
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
