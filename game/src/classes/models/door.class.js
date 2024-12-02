export class Door {
  constructor(doorId) {
    this.doorId = doorId;
    this.status = false; // true: 열림, false: 닫힘
  }

  isOpenDoor() {
    return this.status === true;
  }
  openDoor() {
    this.status = true;
  }
  closeDoor() {
    this.status = false;
  }
}
