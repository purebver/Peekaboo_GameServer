import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { sendCreateRoomResponse } from '../../../response/room/room.response.js';
import { addGameSession } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';
import { v4 as uuidv4 } from 'uuid';

export const createRoomHandler = async ({ socket, payload }) => {
  const { userId, token } = payload;

  // ------------ TODO: token 검증 ---------------

  // 유저 세션 검증
  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  // 게임 생성
  const gameUUID = uuidv4();

  // 게임을 만들고, 게임세션 배열에 추가한다.
  const gameSession = addGameSession(gameUUID);
  // 방을 만들고 유저를 참가시킨다.
  // 그리고 이 유저를 Host로 지정한다.
  gameSession.addUser(user, true);

  // createRoomResponse를 보내준다.
  sendCreateRoomResponse(socket);
};
