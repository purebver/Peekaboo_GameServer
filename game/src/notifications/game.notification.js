import { getProtoMessages } from '../init/load.protos.js';
import { PACKET_TYPE } from '../constants/header.js';
import { serializer } from '../utils/packet/create.packet.js';
import { GAME_SESSION_STATE } from '../constants/state.js';

// 게임에 관련된 알림을 제공하는 함수

/**
 * 귀신의 움직임값을 보내주는 함수입니다.
 */
export const ghostsLoacationNotification = (gameSession) => {
  // 보내줄 데이터 추출하여 정리
  const ghostMoveinfos = gameSession.ghosts.map((ghost) => {
    const ghostMoveinfo = {
      ghostId: ghost.id,
      moveInfo: {
        position: ghost.position,
        rotation: ghost.rotation,
        characterState: ghost.state,
      },
    };

    return ghostMoveinfo;
  });

  // 해당 게임 세션에 참여한 유저들에게 notification 보내주기
  gameSession.users.forEach((user) => {
    // 호스트 빼고 보내주기
    if (user.id === gameSession.hostId) {
      return;
    }
    const responseData = serializer(
      PACKET_TYPE.GhostMoveNotification,
      ghostMoveinfos,
      0,
    );
    user.socket.write(responseData);
  });
};

/**
 * 유저의 움직임 값을 보내주는 함수 // 본인제외 보내기 (avgLatency)
 */
export const usersLocationNotification = (gameSession) => {
  const userLocations = gameSession.users.map((user) => {
    const locationData = {
      userId: user.id,
      position: user.position.getPosition(),
    };
    return locationData;
  });

  const userLocationPayload = serializer(
    PACKET_TYPE.PlayerMoveNotification,
    userLocations,
    0,
  );
  gameSession.users.forEach((user) => {
    user.socket.write(userLocationPayload);
  });
};

export const startGameNotification = (gameSeesion) => {
  const payload = {
    mapId: 1,
    gameSessionState: gameSeesion.state,
  };

  const packet = serializer(PACKET_TYPE.StartGameNotification, payload, 0);

  gameSeesion.users.forEach((user) => {
    user.socket.write(packet);
  });
};
