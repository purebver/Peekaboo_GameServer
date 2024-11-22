import redisManager from '../classes/managers/redisManager.js';
import { Position } from '../classes/models/moveInfo.class.js';

const USER_SET = 'user';

const REDIS_FEILD_NAME = {
  GAME_ID: 'gameId',
  POSITION: 'position',
};

/**
 * 해당 유저의 정보를 redis에 저장하는 함수입니다.
 * @param {*} userId
 * @param {*} gameId
 * @param {*} position
 */
export const saveUserRedis = async (userId, gameId, position) => {
  const key = `${USER_SET}:${userId}`;

  await redisManager.getClient().set(key, JSON.stringify({ gameId, position }));
};

/**
 * redis에 저장한 해당 유저 정보를 반환하는 함수입니다.
 * @param {*} userId
 * @returns
 */
export const getUserRedis = async (userId) => {
  const key = `${USER_SET}:${userId}`;

  const userData = await redisManager.getClient().get(key);
  return JSON.parse(userData);
};

export const removeUserRedis = async (userId) => {
  const key = `${USER_SET}:${userId}`;

  await redisManager.getClient().del(key);
};

// const testId = 'aaa';
// const gameId = 'asdf';
// const position = new Position();

// await saveUserRedis(testId, gameId, position);
// const userData = await getUserRedis(testId);

// console.log(userData.position);

// await removeUserRedis(testId);
