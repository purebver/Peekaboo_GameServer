import redisManager from '../classes/managers/redisManager.js';
import { config } from '../config/config.js';

/**
 * 해당 유저의 정보를 redis에 저장하는 함수입니다.
 * @param {*} userId
 * @param {*} gameId
 * @param {*} position
 */
export const setUserRedis = async (userId, gameId, position = null) => {
  const key = `${config.redis.user_set}:${userId}`;

  const data = {
    gameId: gameId,
    position: JSON.stringify(position),
  };

  // 유효 시간 구하기 TODO 게임 스테이지 전체 시간 - 진행 시간 = 유효 시간

  await redisManager.getClient().hset(key, data);

  // 키에 유효 시간 설정
  await redisManager.getClient().expire(key, 640); // 임시 시간 640 10분 40초
};

/**
 * redis에 저장한 해당 유저 정보를 반환하는 함수입니다.
 * @param {*} userId 해당 유저 id
 * @param {*} feild 원하는 필드 값
 * @returns feild를 추가하지 않으면 기본적으로 유저의 모든 정보를 반환합니다.
 */
export const getUserRedis = async (userId, feild = null) => {
  const key = `${config.redis.user_set}:${userId}`;

  let data;
  switch (feild) {
    case 'gameId':
      {
        data = await redisManager.getClient().hget(key, 'gameId');
      }
      break;
    case 'position':
      {
        data = await redisManager.getClient().hget(key, 'position');
        data = JSON.parse(data);
      }
      break;
    default: {
      data = await redisManager.getClient().hgetall(key);
      data = {
        gameId: data.gameId,
        position: JSON.parse(data.position),
      };
    }
  }
  return data;
};

/**
 * redis에 저장한 해당 유저 정보를 반환하는 함수입니다.
 * @param {*} userId
 * @returns
 */
export const removeUserRedis = async (userId) => {
  const key = `${config.redis.user_set}:${userId}`;

  await redisManager.getClient().del(key);
};
