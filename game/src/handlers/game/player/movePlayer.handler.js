import CustomError from '../../../Error/custom.error.js';
import { getUserById } from '../../../sessions/user.sessions.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { usersLocationNotification } from '../../../notifications/player/player.notification.js';

// 플레이어 이동 요청에 따른 핸들러 함수
export const movePlayerRequestHandler = ({ socket, payload }) => {
  try {
    const { playerMoveInfo } = payload;

    const { userId, position, rotation } = playerMoveInfo;

    // 유저 찾기
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
    }

    const gameSession = getGameSessionById(user.gameId);

    //이전 값 저장
    user.character.lastPosition.updateClassPosition(user.character.position);
    user.character.lastRotation.updateClassRotation(user.character.rotation);

    //수정 해야함
    user.character.position.updatePosition(position.x, position.y, position.z);
    user.character.rotation.updateRotation(rotation.x, rotation.y, rotation.z);

    //시간 저장
    user.character.lastUpdateTime = Date.now();

    usersLocationNotification(gameSession);
  } catch (e) {
    console.error(e.message);
  }
};
