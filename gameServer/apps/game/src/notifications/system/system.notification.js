import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { gameSessions } from '../../sessions/sessions.js';

/**
 * 연결 종료한 유저를 접속 중인 다른 유저들에게 disconnectPlayerNotification로 알려주는 함수
 * @param {*} gameSession
 * @param {*} disconnectUserId
 */
export const disconnectPlayerNotification = async (
  gameSession,
  disconnectUserId,
) => {
  const payload = {
    userId: disconnectUserId,
  };

  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.DisconnectPlayerNotification,
      payload,
      user.socket.sequence++,
    );
    user.socket.write(packet);
  });
};

export const blockInteractionNotification = (gameSession) => {
  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.BlockInteractionNotification,
      {},
      user.socket.sequence++,
    );

    user.socket.write(packet);
  });
};

export const remainingTimeNotification = (gameSession) => {
  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.RemainingTimeNotification,
      { remainingTime: gameSession.remainingTime },
      user.socket.sequence++,
    );

    user.socket.write(packet);
  });
};

export const stageEndNotification = (gameSession) => {
  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.StageEndNotification,
      { difficultyId: gameSession.difficultyId },
      user.socket.sequence++,
    );

    user.socket.write(packet);
  });
};
