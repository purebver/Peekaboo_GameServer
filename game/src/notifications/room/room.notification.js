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

  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.JoinRoomNotification,
      payload,
      user.socket.sequence++,
    );
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

  gameSession.users.forEach((user) => {
    if (user.id !== userId) {
      const packet = serializer(
        PACKET_TYPE.StartStageNotification,
        payload,
        user.socket.sequence++,
      );
      user.socket.write(packet);
    }
  });
};
