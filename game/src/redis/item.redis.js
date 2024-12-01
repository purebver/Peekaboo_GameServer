import redisManager from '../classes/managers/redisManager.js';
import { config } from '../config/config.js';

export const checkSetInventorySlotRedis = async (userId, inventorySlot) => {
  let count = 0;
  let i = inventorySlot;
  while (count < 4) {
    const lockKey = `lock:userId:inventorySlot:${i}`;
    const lock = await redisManager
      .getClient()
      .set(lockKey, i, 'NX', 'PX', 650);
    if (!lock) {
      continue;
    }
    const Key = `${config.redis.user_set}:${userId}:${i}`;
    if (!(await redisManager.getClient().exists(Key))) {
      return [1, i];
    }
    i = (i % 4) + 1;
    count++;
  }

  //인벤토리에 이미 아이템이 있을 경우
  return [0, 0];
};

export const getItemRedis = async (userId, inventorySlot) => {
  const key = `${config.redis.user_set}:${userId}:${inventorySlot}`;

  return await redisManager.getClient().get(key);
};

export const removeItemRedis = async (userId, inventorySlot) => {
  const key = `${config.redis.user_set}:${userId}:${inventorySlot}`;

  await redisManager.getClient().del(key);
};

export const clearItemRedis = async (userId) => {
  await Promise.all(
    [1, 2, 3, 4].map((inventorySlot) => {
      const key = `${config.redis.user_set}:${userId}:${inventorySlot}`;
      redisManager.getClient().del(key);
    }),
  );
};
