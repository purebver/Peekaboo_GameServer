import { Position, Rotation } from './moveInfo.class.js';

class Ghost {
  constructor(id, ghostTypeId, position, rotation, state) {
    this.id = id;
    this.ghostTypeId = ghostTypeId;
    this.position = new Position(position.x, position.y, position.z);
    this.rotation = new Rotation(rotation.x, rotation.y, rotation.z);
    this.state = state;
  }
}

export default Ghost;
