import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';

/**
 * 귀신의 움직임값을 보내주는 함수입니다.
 */
export const ghostsLocationNotification = (gameSession) => {
  // 보내줄 데이터 추출하여 정리
  const ghostMoveInfos = gameSession.ghosts.map((ghost) => {
    const ghostMoveInfo = {
      ghostId: ghost.id,
      position: ghost.position.getPosition(),
      rotation: ghost.rotation.getRotation(),
    };

    return ghostMoveInfo;
  });

  // 해당 게임 세션에 참여한 유저들에게 notification 보내주기
  gameSession.users.forEach((user) => {
    // 호스트 빼고 보내주기
    if (user.id === gameSession.hostId) {
      return;
    }
    const responseData = serializer(
      PACKET_TYPE.GhostMoveNotification,
      { ghostMoveInfos },
      0,
    );
    user.socket.write(responseData);
  });
};
