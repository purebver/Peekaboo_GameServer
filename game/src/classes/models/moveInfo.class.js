export class Position {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  updatePosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
  }

  getPosition() {
    return {
      positionX: this.x,
      positionY: this.y,
      positionZ: this.z,
    };
  }
}

export class Rotation {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  updateRotation(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  updateRotation(rotation) {
    this.x = rotation.x;
    this.y = rotation.y;
    this.z = rotation.z;
  }

  getRotation() {
    return {
      rotationX: this.x,
      rotationY: this.y,
      rotationZ: this.z,
    };
  }
}
