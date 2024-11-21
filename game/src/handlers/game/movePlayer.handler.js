import { getGameSession } from '../../sessions/game.session.js';

// 플레이어 이동 요청에 따른 핸들러 함수
export const movePlayerRequestHandler = ({ socket, payload }) => {
  try {
    const { playerMoveInfo } = payload;

    const { userId, moveInfo } = playerMoveInfo;
    const { position, rotation, characterState } = moveInfo;

    // 현재 프로토빌드로 게임 첫번째 세션을 반환하도록 함.
    const gameSession = getGameSession();

    // 게임 세션에서 유저 찾기
    const user = gameSession.getUser(userId);
    if (!user) {
      console.error(e.message);
    }

    //이전 값 저장
    user.character.lastPosition.updatePosition(user.character.position);
    user.character.lastRotation.updateRotation(user.character.rotation);

    //수정 해야함
    user.character.position.updatePosition(
      position.positionX,
      position.positionY,
      position.positionZ,
    );
    user.character.rotation.updateRotation(
      rotation.rotationX,
      rotation.rotationY,
      rotation.rotationZ,
    );
    console.error(characterState);
    user.character.state = characterState;

    //시간 저장
    user.character.lastUpdateTime = Date.now();
  } catch (e) {
    console.error(e.message);
  }
};
