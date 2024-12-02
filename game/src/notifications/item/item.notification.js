import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';

export const itemChangeNotification = (gameSession, userId, itemId) => {
  const payload = {
    userId,
    itemId,
  };
  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.ItemChangeNotification,
      payload,
      user.socket.sequence++,
    );
    user.socket.write(packet);
  });
};

export const itemUseNotification = (gameSession, userId, itemId) => {
  const payload = {
    userId,
    itemId,
  };

  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.ItemUseNotification,
      payload,
      user.socket.sequence++,
    );
    user.socket.write(packet);
  });
};

export const itemDiscardNotification = (gameSession, itemInfo, position) => {
  const payload = {
    itemInfo,
    position: position.getPosition(),
  };

  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.ItemDiscardNotification,
      payload,
      user.socket.sequence++,
    );
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

  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.ItemDeleteNotification,
      payload,
      user.socket.sequence++,
    );
    user.socket.write(packet);
  });
};

export const itemDisuseNotification = (gameSession, userId, itemId) => {
  const payload = {
    userId,
    itemId,
  };

  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.ItemDisuseNotification,
      payload,
      user.socket.sequence++,
    );
    user.socket.write(packet);
  });
};

export const itemCreateNotification = (gameSession, itemInfo) => {
  gameSession.users.forEach((user) => {
    if (gameSession.hostId !== user.id) {
      const packet = serializer(
        PACKET_TYPE.ItemCreateNotification,
        itemInfo,
        user.socket.sequence++,
      );

      user.socket.write(packet);
    }
  });
};
