import { PACKET_TYPE } from '../../constants/header.js';
import { serializer } from '../../utils/packet/create.packet.js';

export const itemGetResponse = (socket, itemId, inventorySlot) => {
  const newPayload = {
    itemId,
    inventorySlot,
  };
  const packet = serializer(
    PACKET_TYPE.ItemGetResponse,
    newPayload,
    socket.sequence++,
  );
  socket.write(packet);
};

export const itemUseResponse = (socket, itemId, inventorySlot) => {
  const responsePayload = {
    itemId,
    inventorySlot,
  };
  const packet = serializer(
    PACKET_TYPE.ItemUseResponse,
    responsePayload,
    socket.sequence++,
  );

  socket.write(packet);
};

export const itemDiscardResponse = (socket, inventorySlot) => {
  const responsePayload = {
    inventorySlot,
  };
  const packet = serializer(
    PACKET_TYPE.ItemDiscardResponse,
    responsePayload,
    socket.sequence++,
  );

  socket.write(packet);
};
