import Ghost from '../../classes/models/ghost.class.js';
import { config } from '../../config/config.js';
import CustomError from '../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';
import { handleError } from '../../Error/error.handler.js';
import { invalidTokenResponse } from '../../response/auth.response.js';
import { sendConnectGameResponse } from '../../response/auth.response.js';
import { getGameSession } from '../../sessions/game.session.js';
import { addUser } from '../../sessions/userSessions.js';

export const connectGameRequestHandler = ({ socket, payload }) => {
  try {
    const { userId, token } = payload;

    if (config.test.test_token !== token) {
      invalidTokenResponse(socket);
      throw new CustomError(ErrorCodesMaps.AUTHENTICATION_ERROR);
    }

    // 유저 생성 및 인메모리 세션 저장
    const user = addUser(userId, socket);

    socket.userId = user.id;

    // 게임 세션 참가 로직 (임시 로직)
    // 현재 init/index.js에서 게임 세션 하나를 임시로 생성해 두었습니다.
    const gameSession = getGameSession();

    // 본인 제외 이미 게임에 존재하는 유저들
    const existUserIds = gameSession.users.map((user) => user.id);
    gameSession.addUser(user);

    sendConnectGameResponse(socket, gameSession, existUserIds);
  } catch (e) {
    handleError(e);
  }
};

export const spawnInitialGhostRequestHandler = ({ socket, payload }) => {
  try {
    const { ghosts } = payload;

    const gameSession = getGameSession();
    if (!gameSession) {
      throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
    }

    ghosts.forEach((ghostInfo) => {
      const ghost = new Ghost(
        ghostInfo.ghostId,
        ghostInfo.ghostTypeId,
        ghostInfo.moveInfo.position,
        ghostInfo.moveInfo.rotation,
        ghostInfo.moveInfo.state,
      );

      gameSession.addGhost(ghost);
    });

    gameSession.startGame();
  } catch (e) {
    handleError(e);
  }
};
