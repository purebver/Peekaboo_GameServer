import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import {
  itemChangeNotification,
  itemDiscardNotification,
  itemDisuseNotification,
  itemUseNotification,
} from '../../../notifications/item/item.notification.js';
import {
  checkInventoryRedis,
  getItemRedis,
  removeItemRedis,
  setItemRedis,
} from '../../../redis/item.redis.js';
import {
  itemDiscardResponse,
  itemGetResponse,
  itemUseResponse,
} from '../../../response/item/item.response.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';

// 아마도 불큐 사용할 구간
export const itemGetRequestHandler = async ({ socket, payload }) => {
  const { itemId, inventorySlot } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  const [bool, newInventorySlot] = await setItemRedis(
    socket.userId,
    inventorySlot,
    itemId,
  );

  // 모든 슬롯에 아이템이 있을경우 처리 중지
  if (!bool) {
    return;
  }

  // 응답 보내주기
  itemGetResponse(socket, itemId, newInventorySlot);

  // 손에 들어주기
  itemChangeNotification(gameSession, socket.userId, itemId);

  if (!gameSession.ghostCSpawn) {
    const check = checkInventoryRedis(socket.userId);
    if (check) {
      gameSession.ghostCSpawn === true;
      //ghostC 소환 요청 로직 추가
    }
  }
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

  // 손에 들어주기
  itemChangeNotification(gameSession, socket.userId, itemId);
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

  //아이템 타입에 따라 사용 가능 불가능 구분하여 적용
  // switch(item.typeId){
  //   case
  // }

  item.on = true;

  //추후 아이템 타입에 따른 핸들링 필요

  await removeItemRedis(socket.userId, inventorySlot);

  itemUseResponse(socket, itemId, inventorySlot);

  itemUseNotification(gameSession, socket.userId, itemId);
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
  if (itemInfo.itemId !== itemId) {
    throw new CustomError(ErrorCodesMaps.ITEM_DETERIORATION);
  }

  await removeItemRedis(socket.userId, inventorySlot);

  itemDiscardResponse(socket, inventorySlot);

  itemDiscardNotification(gameSession, itemInfo, user.character.position);
};

export const itemDisuseRequestHandler = async ({ socket, payload }) => {
  const { itemId } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  const item = gameSession.getItem(itemId);

  if (!item) {
    throw new CustomError(ErrorCodesMaps.ITEM_NOT_FOUND);
  }

  item.on = false;

  itemDisuseNotification(gameSession, socket.userId, itemId);
};
