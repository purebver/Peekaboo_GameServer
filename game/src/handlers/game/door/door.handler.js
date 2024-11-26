import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { doorToggleNotification } from '../../../notifications/game.notification.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';

export const doorToggleRequestHandler = async ({ socket, payload }) => {
  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  doorToggleNotification(gameSession, payload);
};
