import Ghost from '../../../classes/models/ghost.class.js';
import Item from '../../../classes/models/item.class.js';
import { PACKET_TYPE } from '../../../constants/header.js';
import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import { handleError } from '../../../Error/error.handler.js';
import { startStageNotification } from '../../../notifications/room/room.notification.js';
import { blockInteractionNotification } from '../../../notifications/system/system.notification.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';
import { serializer } from '../../../utils/packet/create.packet.js';

export const startStageRequestHandler = ({ socket, payload }) => {
  try {
    const { gameSessionId, difficultyId } = payload;

    const gameSession = getGameSessionById(gameSessionId);
    if (!gameSession) {
      throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
    }

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

    blockInteractionNotification(gameSession);

    socket.write(packet);
  } catch (e) {
    handleError(e);
  }
};

export const spawnInitialDataResponseHandler = ({ socket, payload }) => {
  const { itemInfos } = payload;

  const user = getUserById(socket.userId);

  const gameSession = getGameSessionById(user.gameId);

  itemInfos.forEach((itemInfo) => {
    const item = new Item(
      itemInfo.itemId,
      itemInfo.itemTypeId,
      itemInfo.position,
    );
    gameSession.addItem(item);
  });

  startStageNotification(gameSession, socket.userId, itemInfos);

  gameSession.startGame();
};
