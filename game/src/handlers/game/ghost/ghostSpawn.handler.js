import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';
import Ghost from '../../../classes/models/ghost.class.js';
import { ghostSpawnNotification } from '../../../notifications/ghost/ghost.notification.js';

/**
 * 귀신의 특수 상태 요청에 대한 핸들러 함수입니다. (호스트만 요청)
 */
export const ghostSpawnHandler = ({ socket, payload }) => {
  try {
    const { ghostInfo } = payload;

    const { position, rotation } = ghostInfo.moveInfo;

    const user = getUserById(socket.userId);
    if (!user) {
      throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
    }

    const gameSession = getGameSessionById(user.gameId);
    if (!gameSession) {
      throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
    }

    const ghost = new Ghost(
      ghostInfo.id,
      ghostInfo.ghostTypeId,
      position,
      rotation,
    );

    gameSession.addGhost(ghost);

    ghostSpawnNotification(gameSession, ghostInfo);
  } catch (e) {
    handleError(e);
  }
};
