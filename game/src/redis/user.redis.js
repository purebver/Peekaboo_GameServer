import redisManager from '../classes/managers/redisManager.js';
import User from '../classes/models/user.class.js';

const USER_SET = 'user';

const socketStore = new Map(); // 이렇게 하고 또 해당 유저의 소켓을 찾는 로직을 짜면 될것 같기도 하고 그럼 일단

export const addUser = async (userId, socket) => {
  // const user = new User(userId, socket)

  socketStore.set(userId, socket);

  const key = `${USER_SET}:${userId}`;
  const userData = {
    userId: userId,
  };
  // redisManager.hset(key, userData);
  await redisManager.getClient().set(key, JSON.stringify(userData)); // "EX", 시간 추가로 설정
  return new User(userId, socket);
};

export const removeUser = async (userId) => {
  // 메모리에서 소켓 제거
  const socket = socketStore.get(userId);
  if (socket) {
    socketStore.delete(userId);
  }

  // Redis에서 사용자 데이터 제거
  const key = `${USER_SET}:${userId}`;
  await redisManager.getClient().del(key);
};

export const getUser = async (userId) => {
  const key = `${USER_SET}:${userId}`;
  // redisManager.hget(key, userData);
  const userData = await redisManager.getClient().get(key);
  const { userId: id } = JSON.parse(userData);

  const socket = socketStore.get(userId);

  // 여기선 받은 값들을 이용하여 인스턴스 재생성
  const user = new User(id, socket);
  return user;
};

const testId = 'aaa';

const testSocket = 'socket1';

await addUser(testId, testSocket);

const user = await getUser(testId);

console.log(user);
