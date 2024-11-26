import redisManager from '../classes/managers/redisManager.js';
import { config } from '../config/config.js';

export const setItemRedis = async (userId, inventorySlot, itemId) => {
  const key = `${config.redis.user_set}:${userId}:${inventorySlot}`;

  //임시 유효시간
  const time = 640;
  if (await redisManager.getClient().exists(key)) {
    for (let i = 1; i <= 4; i++) {
      if (i === inventorySlot) {
        continue;
      }
      const newKey = `${config.redis.user_set}:${userId}:${i}`;
      if (!(await redisManager.getClient().exists(key))) {
        await redisManager.getClient().set(newKey, itemId, 'EX', time);
        return [1, i];
      }
    }
    //인벤토리에 이미 아이템이 있을 경우
    return [0, 0];
  }
  await redisManager.getClient().set(key, itemId, 'EX', time);
  return [1, inventorySlot];
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
