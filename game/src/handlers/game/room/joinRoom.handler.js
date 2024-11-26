import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { getUserById } from '../../../sessions/user.sessions.js';
import { getGameSessionByInviteCode } from '../../../sessions/game.session.js';
import { sendJoinRoomResponse } from '../../../response/room/room.response.js';
import { joinRoomNotification } from '../../../notifications/room/room.notification.js';

export const joinRoomHandler = async ({ socket, payload }) => {
  const { userId, inviteCode } = payload;

  // 유저 검증
  const user = getUserById(socket.userId);
  if (!user && userId !== user.id) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  // inviteCode로 참가할 방 검증
  const gameSession = getGameSessionByInviteCode(inviteCode);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  // 플레이어를 참가시키기 전에
  // 기존에 참가한 유저들에게 참가할 플레이어를 joinRoomNotification로 알려준다.
  joinRoomNotification(gameSession, user.id);

  // 방에 유저를 참가시킨다.
  gameSession.addUser(user);

  // 참가한 유저에게 joinRoomResponse를 보내준다.
  sendJoinRoomResponse(socket, gameSession);
};
