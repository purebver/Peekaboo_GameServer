import Queue from 'bull';
import { config } from '../../config/config.js';
import { doorToggleNotification } from '../../notifications/door/door.notification.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import CustomError from '../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';

class DoorQueueManager {
  constructor(gameId) {
    this.queue = new Queue(`${gameId}:doorQueue`, {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
    });

    this.queue.process(4, async (job) => {
      const startTime = Date.now();

      const { gameSessionId, userId, doorId, isDoorToggle } = job.data;

      // Lock 예시
      // const lockKey = `lock:door:${doorId}`;
      // const lock = await redisManager
      //   .getClient()
      //   .set(lockKey, doorId, 'NX', 'PX', 100); //0.3초
      // if (!lock) {
      //   return;
      // }

      // 게임 세션 검증
      const gameSession = getGameSessionById(gameSessionId);
      if (!gameSession) {
        throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
      }

      // 문 검증
      const door = gameSession.getDoor(doorId);
      if (!door) {
        throw new CustomError(ErrorCodesMaps.DOOR_NOT_FOUND);
      }

      // 현재 문 상태와 문 상호작용 상태 비교 검증
      // 둘의 상태가 달라야 상호작용이 가능하다.
      if (isDoorToggle === door.getStatus()) {
        console.log(
          `"Fail ${
            isDoorToggle ? 'Open' : 'Close'
          }" [${doorId}] Door by User ${userId}`,
        );
        return;
      }

      // 문 상호작용 처리
      isDoorToggle ? door.openDoor() : door.closeDoor();

      // 문 상호작용 결과에 대한 Notification
      const payload = {
        doorId,
        isDoorToggle,
      };

      doorToggleNotification(gameSession, payload);

      // doorQueue Log
      const endTime = Date.now();
      console.log(
        `"Success ${
          isDoorToggle ? 'Open' : 'Close'
        }" [${doorId}] Door by User ${userId}`,
      );
      console.log(`Elapsed Time : ${endTime - startTime}`);
    });

    this.queue.on('failed', (job, err) => {
      console.error(`Job ${job.id} 실패 error:`, err);
    });
  }
}

export default DoorQueueManager;
