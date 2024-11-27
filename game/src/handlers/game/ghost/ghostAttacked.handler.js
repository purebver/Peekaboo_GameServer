import { CHARACTER_STATE } from '../../../constants/state.js';
import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { handleError } from '../../../Error/error.handler.js';
import { ghostStateChangeNotification } from '../../../notifications/ghost/ghost.notification.js';

import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';

// 호스트 유저만 요청을 보내고 실제로 귀신이 유저의 샤우팅에의해 떼어졌을떄 요청이 들어옵니다.
export const ghostAttackedRequestHandler = ({ socket, payload }) => {
  try {
    const { userId, ghostId } = payload;

    // user찾기
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
    }

    // user를 통해 게임 세션찾기
    const gameSession = getGameSessionById(user.gameId);
    if (!gameSession) {
      throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
    }

    // 게임 세션에 포함된 ghost찾기
    const ghost = gameSession.getGhost(ghostId);
    if (!ghost) {
      throw new CustomError(ErrorCodesMaps.GHOST_NOT_FOUND);
    }

    ghostStateChangeNotification(
      gameSession,
      ghostId,
      CHARACTER_STATE.ATTACKED,
    );
  } catch (e) {
    handleError(e);
  }
};

// 귀신 피격 정보
// message GhostAttackedInfo {
//   uint32 ghostId = 1;
//   uint32 attackTypeId = 3;

//   GhostState ghostState = 4;
// }

// enum GhostState {
//   IDLE = 1;
//   MOVE = 2;
//   RUN = 3;
//   JUMP = 4;
//   ATTACK = 5;
//   DIED = 6;
//   HIT = 7;
//   COOLDOWN = 8;
//   SHOUT = 9;
// }
