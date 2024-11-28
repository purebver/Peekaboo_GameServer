import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const itemChangeNotification = (gameSession, userId, itemId) => {
  const payload = {
    userId,
    itemId,
  };
  const packet = serializer(PACKET_TYPE.ItemChangeNotification, payload, 0);

  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};

export const itemUseNotification = (gameSession, userId, itemId) => {
  const payload = {
    userId,
    itemId,
  };
  const packet = serializer(PACKET_TYPE.ItemUseNotification, payload, 0);

  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};

export const itemDiscardNotification = (gameSession, itemInfo, position) => {
  const payload = {
    itemInfo,
    position: position.getPosition(),
  };
  const packet = serializer(PACKET_TYPE.ItemDiscardNotification, payload, 0);

  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};
