import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';

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
