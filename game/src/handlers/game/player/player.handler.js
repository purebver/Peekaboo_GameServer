import { GHOST_TYPE_ID } from '../../../constants/ghost.js';
import { PACKET_TYPE } from '../../../constants/header.js';
import { CHARACTER_STATE } from '../../../constants/state.js';
import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { playerStateChangeNotification } from '../../../notifications/game.notification.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';

export const playerStateChangeRequestHandler = async ({ socket, payload }) => {
  const { playerStateInfo } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  user.character.state = playerStateInfo.playerState;

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  playerStateChangeNotification(gameSession, payload);
};

export const playerAttackedRequestHandler = async ({ socket, payload }) => {
  const { userId, ghostId } = payload;

  const user = getUserById(userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  const ghost = gameSession.getGhost(ghostId);
  if (!ghost) {
    throw new CustomError(ErrorCodesMaps.GHOST_NOT_FOUND);
  }

  //어택 타입에 따른 life 수치 조절, user.character.state 변경
  switch (ghost.typeId) {
    case GHOST_TYPE_ID.SMILINGGENTLEMAN:
      user.character.life--;
      break;
    case GHOST_TYPE_ID.MASSAGER:
      break;
    case GHOST_TYPE_ID.NAUGHTYBOY:
      break;
    case GHOST_TYPE_ID.DARKHAND:
      break;
    case GHOST_TYPE_ID.GRIMREAPER:
      user.character.life = 0;
      break;
  }

  if (user.character.life === 0) {
    user.character.state = CHARACTER_STATE.DIED;
  } else {
    user.character.state = CHARACTER_STATE.ATTACKED;
  }

  const lifePayload = {
    life: user.character.life,
  };

  const packet = serializer(PACKET_TYPE.PlayerLifeResponse, lifePayload, 0);

  socket.write(packet);

  const playerStateInfo = {
    userId: userId,
    playerState: user.character.state,
  };
  playerStateChangeNotification(gameSession, playerStateInfo);
};
