import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { ghostStateChangeNotification } from '../../../notifications/ghost/ghost.notification.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';

// 호스트만 요청
export const ghostStateChangeRequestHandler = ({ socket, payload }) => {
  try {
    const { ghostStateInfo } = payload;
    const { ghostId, ghostState } = ghostStateInfo;
    // user찾기
    const user = getUserById(socket.userId);
    if (!user) {
      throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
    }

    // user를 통해 게임 세션찾기
    const gameSession = getGameSessionById(user.gameId);
    if (!gameSession) {
      throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
    }

    ghostStateChangeNotification(gameSession, ghostId, ghostState);
  } catch (e) {
    handleError(e);
  }
};

// message GhostStateInfo {
//     uint32 ghostId = 1;
//     GhostState ghostState = 2;
// }
