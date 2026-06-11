export class SpatialGrid {
  constructor(width, height, cellSize) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.cells = new Array(this.cols * this.rows);
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = [];
    }
  }

  clear() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].length = 0;
    }
  }

  insert(particle) {
    const col = Math.floor(particle.x / this.cellSize);
    const row = Math.floor(particle.y / this.cellSize);
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
      this.cells[row * this.cols + col].push(particle);
      particle.gridCol = col;
      particle.gridRow = row;
    }
  }

  getNeighbors(particle) {
    const neighbors = [];
    const col = particle.gridCol;
    const row = particle.gridRow;
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
          const cell = this.cells[r * this.cols + c];
          for (let i = 0; i < cell.length; i++) {
            if (cell[i].id > particle.id) {
              neighbors.push(cell[i]);
            }
          }
        }
      }
    }
    return neighbors;
  }
}
