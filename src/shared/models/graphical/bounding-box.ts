export class BoundingBox {
  x: number = 0;
  y: number = 0;
  w: number = 5;
  h: number = 5;

  constructor(x: number = 0, y: number = 0, width: number = 5, height: number = 5) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
  }

  toString(): string {
    return '(' + this.x + ', ' + this.y +', ' + this.w + ', ' + this.h + ')';
  }
}
