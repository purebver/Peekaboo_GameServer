import { PACKET_TYPE } from '../constants/header.js';
import { serializer } from '../utils/packet/create.packet.js';

// 게임에 관련된 알림을 제공하는 함수
/**
 * 유저의 움직임 값을 보내주는 함수
 */
export const usersLocationNotification = (gameSession) => {
  const userLocations = gameSession.users.map((user) => {
    const lastPosition = user.character.lastPosition; // 움직이기 전 좌표
    const position = user.character.position; //현 좌표
    const lastRotation = user.character.lastRotation;
    const rotation = user.character.rotation;

    if (
      position.x === lastPosition.x &&
      position.y === lastPosition.y &&
      position.z === lastPosition.z
    ) {
      return {
        userId: user.id,
        moveInfo: {
          position: position.getPosition(),
          rotation: rotation.getRotation(),
          characterState: user.character.state,
        },
      };
    }

    const timeDiff = Math.floor(
      (Date.now() -
        user.character.lastUpdateTime +
        gameSession.getAvgLatency()) /
        1000,
    );
    const distance = user.character.speed * timeDiff;

    const directionX = position.x - lastPosition.x;
    const directionY = position.y - lastPosition.y;
    const directionZ = position.z - lastPosition.z;

    const vectorSize = Math.sqrt(
      Math.pow(directionX, 2) +
        Math.pow(directionY, 2) +
        Math.pow(directionZ, 2),
    );

    const unitVectorX = directionX / vectorSize;
    const unitVectorY = directionY / vectorSize;
    const unitVectorZ = directionZ / vectorSize;

    // 데드레커닝으로 구한 미래의 좌표
    const predictionPosition = {
      x: position.x + unitVectorX * distance,
      y: position.y + unitVectorY * distance,
      z: position.z + unitVectorZ * distance,
    };

    const changingRotation = {
      x: (rotation.x - lastRotation.x) / timeDiff,
      y: (rotation.y - lastRotation.y) / timeDiff,
      z: (rotation.z - lastRotation.z) / timeDiff,
    };

    const predictionRotation = {
      x: (rotation.x + changingRotation.x * timeDiff) % 360,
      y: (rotation.y + changingRotation.y * timeDiff) % 360,
      z: (rotation.z + changingRotation.z * timeDiff) % 360,
    };

    const locationData = {
      userId: user.id,
      moveInfo: {
        position: predictionPosition,
        rotation: predictionRotation,
        characterState: user.character.state,
      },
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

/**
 * 귀신의 움직임값을 보내주는 함수입니다.
 */
export const ghostsLoacationNotification = (gameSession) => {
  // 보내줄 데이터 추출하여 정리
  const ghostMoveinfos = gameSession.ghosts.map((ghost) => {
    const ghostMoveinfo = {
      ghostId: ghost.id,
      moveInfo: {
        position: ghost.position.getPosition(),
        rotation: ghost.rotation.getRotation(),
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
 * 게임 시작을 알리는 함수
 */
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
