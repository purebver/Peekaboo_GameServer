import { serializer } from '../../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../../constants/header.js';

/**
 * 유저의 움직임 값을 보내주는 함수
 */
export const usersLocationNotification = (gameSession) => {
  const userLocations = gameSession.users.map((user) => {
    // console.log(gameSession);

    const lastPosition = user.character.lastPosition; // 움직이기 전 좌표
    const position = user.character.position; //현 좌표
    const rotation = user.character.rotation;

    if (
      position.x === lastPosition.x &&
      position.y === lastPosition.y &&
      position.z === lastPosition.z
    ) {
      return {
        userId: user.id,
        position: position.getPosition(),
        rotation: rotation.getRotation(),
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
    const directionZ = position.z - lastPosition.z;

    const vectorSize = Math.sqrt(
      Math.pow(directionX, 2) + Math.pow(directionZ, 2),
    );
    if (vectorSize < 1) {
      return {
        userId: user.id,
        position: position.getPosition(),
        rotation: rotation.getRotation(),
      };
    }

    const unitVectorX = directionX / vectorSize;
    const unitVectorZ = directionZ / vectorSize;

    // 데드레커닝으로 구한 미래의 좌표
    const predictionPosition = {
      x: position.x + unitVectorX * distance,
      y: position.y,
      z: position.z + unitVectorZ * distance,
    };

    const locationData = {
      userId: user.id,
      position: predictionPosition,
      rotation: rotation.getRotation(),
    };

    return locationData;
  });

  gameSession.users.forEach((user) => {
    const userLocationPayload = serializer(
      PACKET_TYPE.PlayerMoveNotification,
      { playerMoveInfos: userLocations },
      user.socket.sequence++,
    );
    user.socket.write(userLocationPayload);
  });
};

export const playerStateChangeNotification = (gameSession, payload) => {
  gameSession.users.forEach((user) => {
    const packet = serializer(
      PACKET_TYPE.PlayerStateChangeNotification,
      payload,
      user.socket.sequence++,
    );
    user.socket.write(packet);
  });
};
