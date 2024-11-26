import { Position } from './moveInfo.class.js';

class Item {
  constructor(itemId, itemTypeId) {
    this.id = itemId;
    this.typeId = itemTypeId;
    this.position = new Position(); // 필요없어 보이지만 나중에 쓰일 거 같아서 만들어둠
    this.on = 1; // 맵에있음 = 1, 맵에없음 = 0 혹시 나중에 쓰일 거 같아서 만들어둠
    this.active = 1; // 아이템 사용가능 = 1, 불가능 = 0
  }
}

export default Item;
