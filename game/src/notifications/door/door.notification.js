import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const doorToggleNotification = (gameSession, payload) => {
  const packet = serializer(PACKET_TYPE.DoorToggleNotification, payload, 0);

  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};
