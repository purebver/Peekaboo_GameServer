import Ghost from '../../classes/models/ghost.class.js';
import CustomError from '../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';
import { handleError } from '../../Error/error.handler.js';
import { getGameSessionById } from '../../sessions/game.session.js';

// C2S_spawnInitialDataResponse, S2C_spawnInitialDataRequest 이것들 만들때
// 나중에 참고만 하고 삭제 : TODO
export const spawnInitialGhostRequestHandler = ({ socket, payload }) => {
  try {
    const { ghosts } = payload;

    const user = getUserById(socket.userId);
    if (!user) {
      throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
    }

    const gameSession = getGameSessionById(user.gameId);
    if (!gameSession) {
      throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
    }

    ghosts.forEach((ghostInfo) => {
      const ghost = new Ghost(
        ghostInfo.ghostId,
        ghostInfo.ghostTypeId,
        ghostInfo.moveInfo.position,
        ghostInfo.moveInfo.rotation,
      );

      gameSession.addGhost(ghost);
    });

    gameSession.startGame();
  } catch (e) {
    handleError(e);
  }
};
