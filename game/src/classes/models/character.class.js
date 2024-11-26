import { Rotation, Position } from './moveInfo.class.js';
import { CHARACTER_STATE } from '../../constants/state.js';

export class Character {
  constructor() {
    // 게임 정보
    this.position = new Position(5.07, 0.68, 0.11);
    this.lastPosition = new Position(5.07, 0.68, 0.11);
    this.rotation = new Rotation();
    this.lastRotation = new Rotation();
    this.maxLife = 1;
    this.life = 1;
    this.state = CHARACTER_STATE.IDLE;
    this.speed = 1;
    this.latency = null;
    this.lastUpdateTime = Date.now();
  }

  getLastPosition() {
    return this.lastPosition;
  }
}
