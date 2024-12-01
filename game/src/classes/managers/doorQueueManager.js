import Queue from 'bull';
import { config } from '../../config/config.js';
import { doorToggleNotification } from '../../notifications/door/door.notification.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import CustomError from '../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';

class DoorQueueManager {
  constructor() {
    if (!DoorQueueManager.instance) {
      this.queue = new Queue('doorQueue', {
        redis: {
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
        },
      });

      this.queue.process(4, async (job) => {
        const { gameSessionId, doorId, isDoorToggle } = job.data;

        const gameSession = getGameSessionById(gameSessionId);
        if (!gameSession) {
          throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
        }
        const payload = {
          doorId,
          isDoorToggle,
        };

        doorToggleNotification(gameSession, payload);
      });

      this.queue.on('failed', (job, err) => {
        console.error(`Job ${job.id} 실패 error:`, err);
      });

      DoorQueueManager.instance = this;
    }
    return DoorQueueManager.instance;
  }

  getQueue = () => this.queue;
}

const doorQueueManager = new DoorQueueManager();

export default doorQueueManager;
