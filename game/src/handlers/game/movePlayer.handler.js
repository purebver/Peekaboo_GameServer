import { getGameSession } from '../../sessions/game.session.js';

// 플레이어 이동 요청에 따른 핸들러 함수
export const movePlayerRequestHandler = ({ socket, payload }) => {
  try {
    const { playerMoveInfo } = payload;

    const { userId, position, rotation } = playerMoveInfo;

    // 현재 프로토빌드로 게임 첫번째 세션을 반환하도록 함.
    const gameSession = getGameSession();

    // 게임 세션에서 유저 찾기
    const user = gameSession.getUser(userId);
    if (!user) {
      console.error('user가 존재하지 않습니다.');
    }

    //이전 값 저장
    user.character.lastPosition.updateClassPosition(user.character.position);
    user.character.lastRotation.updateClassRotation(user.character.rotation);

    //수정 해야함
    user.character.position.updatePosition(position.x, position.y, position.z);
    user.character.rotation.updateRotation(rotation.x, rotation.y, rotation.z);

    user.character.state = characterState;

    //시간 저장
    user.character.lastUpdateTime = Date.now();
  } catch (e) {
    console.error(e.message);
  }
};
