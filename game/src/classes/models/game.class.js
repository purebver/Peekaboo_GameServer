import IntervalManager from '../managers/interval.manager.js';
import { GAME_SESSION_STATE } from '../../constants/state.js';
import { Character } from './character.class.js';
import { getInviteCode } from '../../utils/room/inviteCode.room.js';
import { ghostsLocationNotification } from '../../notifications/ghost/ghost.notification.js';
import {
  connectNewPlayerNotification,
  disconnectPlayerNotification,
} from '../../notifications/system/system.notification.js';

class Game {
  constructor(id) {
    this.id = id;
    this.hostId = null;
    this.users = [];
    this.ghosts = [];
    this.items = [];
    this.state = GAME_SESSION_STATE.PREPARE;

    this.inviteCode = getInviteCode();
  }

  startGame() {
    // 귀신 5마리 정도 세팅

    // 게임 상태 변경
    this.state = GAME_SESSION_STATE.INPROGRESS;

    // IntervalManager.getInstance().addPlayersInterval(
    //   this.id,
    //   () => usersLocationNotification(this),
    //   1000 / 60,
    // );

    IntervalManager.getInstance().addGhostsInterval(
      this.id,
      () => ghostsLocationNotification(this),
      100,
    );

    startGameNotification(this);
  }

  async addUser(user, isHost = false) {
    if (isHost) {
      this.hostId = user.id;
    }
    const character = new Character();
    user.attachCharacter(character);

    // 참가한 유저를 이미 참가한 유저에게 Noti
    await connectNewPlayerNotification(this, user);

    this.users.push(user);

    // 핑 인터벌 추가
    IntervalManager.getInstance().addPingInterval(
      user.id,
      user.ping.bind(user),
      1000,
      'user',
    );
  }

  async removeUser(userId) {
    const removeUserIndex = this.users.findIndex((user) => user.id === userId);
    this.users.splice(removeUserIndex, 1);

    // 연결을 종료한 사실을 다른 유저들에게 Noti로 알려준다.
    await disconnectPlayerNotification(this, userId);

    IntervalManager.getInstance().removeUserInterval(userId);
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

  addItem(item) {
    this.items.push(item);
  }

  getItem(itemId) {
    return this.items.find((item) => item.id === itemId);
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
