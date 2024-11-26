import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';

/**
 * 게임 시작을 알리는 함수
 */
export const startGameNotification = (gameSession) => {
  const payload = {
    mapId: 1,
    gameSessionState: gameSession.state,
  };

  const packet = serializer(PACKET_TYPE.StartGameNotification, payload, 0);

  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};

/**
 * 다른 유저가 방에 참가 시 알리는 함수
 */
export const connectNewPlayerNotification = async (gameSession, newUser) => {
  const userId = newUser.id;
  const responseData = serializer(
    PACKET_TYPE.ConnectNewPlayerNotification,
    { userId },
    0,
  );
  gameSession.users.forEach((user) => {
    user.socket.write(responseData);
  });
};

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

  const packet = serializer(
    PACKET_TYPE.DisconnectPlayerNotification,
    payload,
    0,
  );

  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};
