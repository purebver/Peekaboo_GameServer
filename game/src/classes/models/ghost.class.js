import { Position, Rotation } from './moveInfo.class.js';

class Ghost {
  constructor(id, ghostTypeId, position, rotation, state) {
    this.id = id;
    this.ghostTypeId = ghostTypeId;
    this.position = new Position(
      position.positionX,
      position.positionY,
      position.positionZ,
    );
    this.rotation = new Rotation(
      rotation.rotationX,
      rotation.rotationY,
      rotation.rotationZ,
    );
    this.state = state;
  }
}

export default Ghost;
