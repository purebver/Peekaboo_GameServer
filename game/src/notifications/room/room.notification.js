import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { GAME_SESSION_STATE } from '../../constants/state.js';

/**
 * 방에 참가한 플레이어 정보를 기존 유저들에게 알리는 함수
 */
export const joinRoomNotification = (gameSession, userId) => {
  const payload = {
    userId,
  };

  const packet = serializer(PACKET_TYPE.JoinRoomNotification, payload, 0);

  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};

export const startStageNotification = (
  gameSession,
  userId,
  ghostInfos,
  itemInfos,
) => {
  const payload = {
    globalFailCode: 0,
    message: '로딩이 완료되어 게임을 시작합니다.',
    ghostInfos,
    itemInfos,
  };
  const packet = serializer(PACKET_TYPE.StartStageNotification, payload, 0);
  gameSession.users.forEach((user) => {
    if (user.id !== userId) {
      user.socket.write(packet);
    }
  });

  gameSession.state = GAME_SESSION_STATE.INPROGRESS;
};
