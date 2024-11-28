import { Position } from './moveInfo.class.js';

class Item {
  constructor(itemId, itemTypeId, position, rotation) {
    this.id = itemId;
    this.typeId = itemTypeId;
    this.position = new Position(position.x, position.y, position.z);
    this.map = 1; // 맵에있음 = 1, 맵에없음 = 0 혹시 나중에 쓰일 거 같아서 만들어둠
    this.on = false; // 아이템 사용 중 = 1, 사용 x = 0
  }
}

export default Item;
