import Queue from 'bull';
import { config } from '../../config/config.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import CustomError from '../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';
import { getUserById } from '../../sessions/user.sessions.js';
import { itemGetResponse } from '../../response/item/item.response.js';
import {
  itemChangeNotification,
  itemGetNotification,
} from '../../notifications/item/item.notification.js';

class ItemQueueManager {
  constructor(gameId) {
    this.queue = new Queue(`${gameId}:itemQueue`, {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
    });

    this.queue.process(10, async (job) => {
      const startTime = Date.now();
      const { userId, itemId, inventorySlot } = job.data;

      console.log('userId', userId);

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

      const newInventorySlot = user.character.inventory.checkSetInventorySlot(
        inventorySlot,
        itemId,
      );

      if (inventorySlot !== newInventorySlot) {
        console.error('서버에서 인벤토리 슬롯 변경');
      }

      if (!newInventorySlot) {
        return;
      }

      item.mapOn = false;

      // 응답 보내주기
      // itemGetResponse(user.socket, itemId, newInventorySlot);
      itemGetResponse(user.socket, itemId, inventorySlot);
      itemGetNotification(gameSession, itemId, userId);

      // 손에 들어주기
      itemChangeNotification(gameSession, userId, itemId);

      if (!gameSession.ghostCSpawn) {
        if (user.character.inventory.itemCount === 4) {
          gameSession.ghostCSpawn === true;
          //ghostC 소환 요청 로직 추가
        }
      }
      console.log(Date.now() - startTime);
      console.log(user.character.inventory);
    });

    this.queue.on('failed', (job, err) => {
      console.error(`Job ${job.id} 실패 error:`, err);
    });
  }
}

export default ItemQueueManager;
