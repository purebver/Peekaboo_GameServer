import Ghost from '../../../classes/models/ghost.class.js';
import Item from '../../../classes/models/item.class.js';
import { PACKET_TYPE } from '../../../constants/header.js';
import { startStageNotification } from '../../../notifications/room/room.notification.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';
import { serializer } from '../../../utils/packet/create.packet.js';

export const startStageRequestHandler = ({ socket, payload }) => {
  const { gameSessionId, difficultyId } = payload;

  const gameSession = getGameSessionById(gameSessionId);

  gameSession.difficultyId = difficultyId;

  const s2cRequestPayload = {
    globalFailCode: 0,
    difficultyId,
    message: '게임 시작을 요청합니다.',
  };

  const packet = serializer(
    PACKET_TYPE.SpawnInitialDataRequest,
    s2cRequestPayload,
    socket.sequence++,
  );

  socket.write(packet);
};

export const spawnInitialDataResponseHandler = ({ socket, payload }) => {
  const { ghostInfos, itemInfos } = payload;

  const user = getUserById(socket.userId);

  const gameSession = getGameSessionById(user.gameId);

  ghostInfos.forEach((ghostInfo) => {
    const ghost = new Ghost(
      ghostInfo.ghostId,
      ghostInfo.ghostTypeId,
      ghostInfo.moveInfo.position,
      ghostInfo.moveInfo.rotation,
    );
    gameSession.addGhost(ghost);
  });

  itemInfos.forEach((itemInfo) => {
    const item = new Item(
      itemInfo.itemId,
      itemInfo.itemTypeId,
      itemInfo.position,
    );
    gameSession.addItem(item);
  });

  startStageNotification(gameSession, socket.userId, ghostInfos, itemInfos);

  gameSession.startGame();
};
