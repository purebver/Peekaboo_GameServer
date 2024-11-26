import { PACKET_TYPE } from '../../../constants/header.js';
import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import {
  itemChangeNotification,
  itemDiscardNotification,
  itemUseNotification,
} from '../../../notifications/item/item.notification.js';
import {
  getItemRedis,
  removeItemRedis,
  setItemRedis,
} from '../../../redis/item.redis.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';

// 아마도 불큐 사용할 구간
export const itemGetRequestHandler = async ({ socket, payload }) => {
  const { itemInfo, inventorySlot } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  const [bool, newInventorySlot] = await setItemRedis(
    userId,
    inventorySlot,
    itemInfo.itemId,
  );

  // 이미 슬롯에 아이템이 있을경우 처리 중지
  if (!bool) {
    return;
  }

  const newPayload = {
    itemInfo,
    inventorySlot: newInventorySlot,
  };

  // 아이템 슬롯으로
  const packet = serializer(PACKET_TYPE.ItemGetResponse, newPayload, 0);
  socket.write(packet);

  // 손에 들어주기
  itemChangeNotification(gameSession, socket.userId, itemInfo);
};

export const itemChangeRequestHandler = async ({ socket, payload }) => {
  const { inventorySlot } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  const itemId = await getItemRedis(socket.userId, inventorySlot);
  const item = gameSession.getItem(itemId);
  if (!item) {
    throw new CustomError(ErrorCodesMaps.ITEM_NOT_FOUND);
  }

  const itemInfo = {
    itemId,
    itemTypeId: item.itemTypeId,
  };

  // 손에 들어주기
  itemChangeNotification(gameSession, socket.userId, itemInfo);
};

export const itemUseRequestHandler = async ({ socket, payload }) => {
  const { inventorySlot } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  const itemId = await getItemRedis(socket.userId, inventorySlot);
  const item = gameSession.getItem(itemId);
  if (!item) {
    throw new CustomError(ErrorCodesMaps.ITEM_NOT_FOUND);
  }

  //사용 불가능한 아이템일 경우 처리안함
  if (!item.active) {
    return;
  }

  await removeItemRedis(socket.userId, inventorySlot);

  const itemInfo = {
    itemId,
    itemTypeId: item.itemTypeId,
  };

  const responsePayload = {
    itemInfo,
    inventorySlot,
  };

  const packet = serializer(PACKET_TYPE.ItemUseResponse, responsePayload, 0);

  socket.write(packet);

  itemUseNotification(gameSession, socket.userId, itemInfo);
};

export const itemDiscardRequestHandler = async ({ socket, payload }) => {
  const { itemInfo, inventorySlot } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  const itemId = await getItemRedis(socket.userId, inventorySlot);
  const item = gameSession.getItem(itemId);
  if (!item) {
    throw new CustomError(ErrorCodesMaps.ITEM_NOT_FOUND);
  }

  await removeItemRedis(socket.userId, inventorySlot);

  const responsePayload = {
    inventorySlot,
  };

  const packet = serializer(
    PACKET_TYPE.ItemDiscardResponse,
    responsePayload,
    0,
  );

  socket.write(packet);

  itemDiscardNotification(gameSession, itemInfo, user.character.position);
};
