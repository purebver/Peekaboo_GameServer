export class Inventory {
  constructor() {
    this.slot = [null, null, null, null];
    this.itemCount = 0;
  }

  checkSetInventorySlot(clientSlot, itemId) {
    let count = 0;
    let i = clientSlot - 1;
    while (count < 4) {
      if (!this.slot[i]) {
        this.slot[i] = itemId;
        this.itemCount++;
        return i + 1;
      }
      i = (i % 3) + 1;
      count++;
    }
    return null;
  }

  removeInventorySlot(clientSlot) {
    const itemId = this.slot[clientSlot];
    this.slot[clientSlot] = null;
    this.itemCount--;
    return itemId;
  }
}
