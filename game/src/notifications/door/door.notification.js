import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const doorToggleNotification = (gameSession, payload) => {
  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.DoorToggleNotification,
      payload,
      user.socket.sequence++,
    );
    user.socket.write(packet);
  });
};
