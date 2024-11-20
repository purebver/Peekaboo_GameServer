import IntervalManager from '../managers/interval.manager.js';
import { ghostsLoacationNotification } from '../../notifications/game.notification.js';
import { usersLocationNotification } from '../../notifications/game.notification.js';
import { startGameNotification } from '../../notifications/game.notification.js';
import { GAME_SESSION_STATE } from '../../constants/state.js';
import { Character } from './character.class.js';

class Game {
  constructor(id) {
    this.id = id;
    this.hostId = null;
    this.users = [];
    this.ghosts = [];
    this.state = GAME_SESSION_STATE.PREPARE;
  }

  startGame() {
    // 귀신 5마리 정도 세팅

    // 게임 상태 변경
    this.state = G;

    IntervalManager.getInstance().addPlayersInterval(
      this.id,
      usersLocationNotification(this),
      1000 / 60,
    );
    IntervalManager.getInstance().addGhostsInterval(
      this.id,
      ghostsLoacationNotification(this),
      1000 / 60,
    );

    startGameNotification(this);
  }

  addUser(user) {
    if (!this.hostId) {
      this.hostId = user.id;
    }
    const character = new Character();
    user.attachCharacter(character);
    this.users.push(user);

    // 핑 인터벌 추가
    IntervalManager.getInstance().addPingInterval(
      user.id,
      user.ping.bind(user),
      1000,
      'user',
    );
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  addGhost(ghost) {
    this.ghosts.push(ghost);
  }

  getGhost(ghostId) {
    return this.ghosts.find((ghost) => ghost.id === ghostId);
  }

  // 평균 레이턴시 구하기
  getAvgLatency() {
    const totalLatency = this.users.reduce((total, user) => {
      return total + user.character.latency;
    }, 0);

    const avgLatency = totalLatency / this.users.length;
    return avgLatency;
  }
}

export default Game;
