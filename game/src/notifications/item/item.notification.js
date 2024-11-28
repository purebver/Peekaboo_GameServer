import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';

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

export const itemDeleteNotification = (gameSession, itemId) => {
  const delItem = gameSession.removeItem(itemId);
  if (delItem === -1) {
    throw new CustomError(ErrorCodesMaps.ITEM_DETERIORATION);
  }

  //아이템 위변조가 일어나도 일단은 보내는걸로
  const payload = {
    itemId,
  };
  const packet = serializer(PACKET_TYPE.ItemDeleteNotification, payload, 0);

  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};

export const itemDisuseNotification = (gameSession, userId, itemId) => {
  const payload = {
    userId,
    itemId,
  };
  const packet = serializer(PACKET_TYPE.ItemDisuseNotification, payload, 0);
  gameSession.users.forEach((user) => {
    user.socket.write(packet);
  });
};
