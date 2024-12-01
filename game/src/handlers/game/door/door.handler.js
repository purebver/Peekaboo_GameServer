import doorQueueManager from '../../../classes/managers/doorQueueManager.js';
import redisManager from '../../../classes/managers/redisManager.js';
import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { doorToggleNotification } from '../../../notifications/door/door.notification.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';

export const doorToggleRequestHandler = async ({ socket, payload }) => {
  const { doorId, isDoorToggle } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  // const gameSession = getGameSessionById(user.gameId);
  // if (!gameSession) {
  //   throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  // }

  // 동시성 제어1
  const lockKey = `lock:door:${doorId}`;
  const lock = await redisManager
    .getClient()
    .set(lockKey, doorId, 'NX', 'PX', 300); //0.3초
  if (!lock) {
    return;
  }

  // 동시성 제어2
  doorQueueManager
    .getQueue()
    .add(
      { gameSessionId: user.gameId, doorId, isDoorToggle, lockKey },
      { jobId: `door:${doorId}`, removeOnComplete: true },
    );
};
