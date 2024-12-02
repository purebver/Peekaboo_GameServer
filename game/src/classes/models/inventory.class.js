import redisManager from '../managers/redisManager.js';

export class Inventory {
  constructor() {
    this.slot = [null, null, null, null];
    this.itemCount = 0;
  }

  removeInventorySlot(clientSlot) {
    const itemId = this.slot[clientSlot];
    this.slot[clientSlot] = null;
    this.itemCount--;
    return itemId;
  }
}
