import { GHOST_TYPE_ID } from '../../constants/ghost.js';
import { Position, Rotation } from './moveInfo.class.js';

class Ghost {
  constructor(id, ghostTypeId, position, rotation, state) {
    this.id = id;
    this.ghostTypeId = ghostTypeId;
    this.position = new Position(position.x, position.y, position.z);
    this.rotation = new Rotation(rotation.x, rotation.y, rotation.z);
    this.state = state;
  }

  setState(state) {
    this.state = state;
  }

  // 고스트 타입에 따른 공격로직
  attack(ghostTypeId, user) {
    switch (ghostTypeId) {
      case GHOST_TYPE_ID.SMILINGGENTLEMAN:
        {
          user.character.life--;
        }
        break;
      case GHOST_TYPE_ID.MASSAGER:
        {
        }
        break;
      case GHOST_TYPE_ID.NAUGHTYBOY:
        {
        }
        break;
      case GHOST_TYPE_ID.DARKHAND:
        {
        }
        break;
      case GHOST_TYPE_ID.GRIMREAPER:
        {
          user.character.life = 0;
        }
        break;
    }
  }
}

export default Ghost;
