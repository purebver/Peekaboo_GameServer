import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';
import Item from '../../../classes/models/item.class.js';
import { itemCreateNotification } from '../../../notifications/item/item.notification.js';
import { handleError } from '../../../Error/error.handler.js';

export const itemCreateHandler = ({ socket, payload }) => {
  try {
    const { itemInfo } = payload;

    const user = getUserById(socket.userId);
    if (!user) {
      throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
    }

    const gameSession = getGameSessionById(user.gameId);
    if (!gameSession) {
      throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
    }

    const item = new Item(
      itemInfo.itemId,
      itemInfo.itemTypeId,
      itemInfo.position,
    );

    gameSession.addItem(item);

    itemCreateNotification(gameSession, itemInfo);
  } catch (e) {
    handleError(e);
  }
};
