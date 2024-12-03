export class BoundingBox {
  x: number = 0;
  y: number = 0;
  width: number = 5;
  height: number = 5;

  constructor(x: number = 0, y: number = 0, width: number = 5, height: number = 5) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
