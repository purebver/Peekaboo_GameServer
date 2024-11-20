import { USER_STATE } from '../../constants/state.js';
import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';

class User {
  constructor(id, socket) {
    // 유저 기본 정보
    this.id = id;
    this.socket = socket;
    this.state = USER_STATE.STAY;

    // 게임 관련 정보
    this.gameId = null;
    this.character = null;
  }

  attachCharacter(character) {
    if (!this.character) {
      this.character = character;
      return;
    }
    console.error('이미 존재하는 캐릭터가 있습니다.');
  }

  // 핑을 보내주고 또 보내라고 요청도 보내고
  ping() {
    const now = Date.now();

    const pingPacket = serializer(
      PACKET_TYPE.PingRequest,
      { timestamp: now },
      this.socket.sequence,
    );

    this.socket.write(pingPacket);
  }

  /**
   * 클라이언의 응답에을 받으면 실행하는 함수
   * 받은 핑(data)의 타임스탬프를 이용해 해당 유저의 레이턴시를 구하는 함수
   */
  receivePing(data) {
    const now = Date.now();
    this.character.latency = (now - data.timestamp) / 2;
    console.log(
      `Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`,
    );
  }
}

export default User;
