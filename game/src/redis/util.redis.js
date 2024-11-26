import CustomError from '../Error/custom.error.js';
import { ErrorCodesMaps } from '../Error/error.codes.js';
import { getUserById } from '../sessions/user.sessions.js';
import { getUserRedis, setUserRedis } from './user.redis.js';

/**
 * 연결이 끊길때 해당 유저의 마지막 정보(data)를 redis에 저장할 함수입니다.
 * @param {*} socket
 */
export const disconnectedUserRedis = async (userId) => {
  const user = getUserById(userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const { gameId } = await getUserRedis(userId);

  await setUserRedis(user.id, gameId, user.character.position.getPosition());
};
