import Queue from 'bull';
import { config } from '../../config/config.js';
import redisManager from './redisManager.js';
import { doorToggleNotification } from '../../notifications/door/door.notification.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import CustomError from '../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';
import { getUserById } from '../../sessions/user.sessions.js';
import { itemGetResponse } from '../../response/item/item.response.js';
import { itemChangeNotification } from '../../notifications/item/item.notification.js';
import { checkSetInventorySlotRedis } from '../../redis/item.redis.js';

class ItemQueueManager {
  constructor() {
    if (!ItemQueueManager.instance) {
      this.queue = new Queue('itemQueue', {
        redis: {
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
        },
      });

      this.queue.process(4, async (job) => {
        const { userId, itemId, inventorySlot } = job.data;

        const user = getUserById(userId);
        if (!user) {
          throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
        }

        const gameSession = getGameSessionById(user.gameId);
        if (!gameSession) {
          throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
        }

        const item = gameSession.getItem(itemId);

        // 혹시 모를 동시성 제어 2
        if (!item.mapOn) {
          return;
        }

        item.mapOn = false;

        const time = 640;

        const [bool, newInventorySlot] = await checkSetInventorySlotRedis(
          userId,
          inventorySlot,
        );

        if (inventorySlot !== newInventorySlot) {
          console.error('서버에서 인벤토리 슬롯 변경');
        }

        if (!bool) {
          return;
        }

        const key = `${config.redis.user_set}:${userId}:${newInventorySlot}`;

        await redisManager.getClient().set(key, itemId, 'EX', time);

        user.character.itemCount++;

        // 응답 보내주기
        itemGetResponse(user.socket, itemId, newInventorySlot);

        // 손에 들어주기
        itemChangeNotification(gameSession, userId, itemId);

        if (!gameSession.ghostCSpawn) {
          if (user.character.itemCount === 4) {
            gameSession.ghostCSpawn === true;
            //ghostC 소환 요청 로직 추가
          }
        }
      });

      this.queue.on('failed', (job, err) => {
        console.error(`Job ${job.id} 실패 error:`, err);
      });

      ItemQueueManager.instance = this;
    }
    return ItemQueueManager.instance;
  }

  getQueue = () => this.queue;
}

const itemQueueManager = new ItemQueueManager();

export default itemQueueManager;
