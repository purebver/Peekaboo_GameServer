import {
  connectGameRequestHandler,
  spawnInitialGhostRequestHandler,
} from './auth/connectGame.handler.js';
import { movePlayerRequestHandler } from './game/movePlayer.handler.js';
import { moveGhostRequestHandler } from './game/moveGhost.handler.js';
import { PACKET_TYPE } from '../constants/header.js';
import { pingHandler } from './game/ping.handler.js';
import { doorToggleRequestHandler } from './game/door/door.handler.js';
import {
  playerAttackedRequestHandler,
  playerStateChangeRequestHandler,
} from './game/player/player.handler.js';
import {
  itemChangeRequestHandler,
  itemDiscardRequestHandler,
  itemGetRequestHandler,
  itemUseRequestHandler,
} from './game/item/item.handler.js';

const handlers = {
  [PACKET_TYPE.ConnectGameRequest]: {
    handler: connectGameRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.PlayerMoveRequest]: {
    handler: movePlayerRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.GhostMoveRequest]: {
    handler: moveGhostRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.SpawnInitialGhostRequest]: {
    handler: spawnInitialGhostRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.PingResponse]: {
    handler: pingHandler,
    protoType: 'common.GamePacket',
  },
  /*-------------------------장재영 작업--------------------------*/
  [PACKET_TYPE.DoorToggleRequest]: {
    handler: doorToggleRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.PlayerStateChangeRequest]: {
    handler: playerStateChangeRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.PlayerAttackedRequest]: {
    handler: playerAttackedRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.ItemGetRequest]: {
    handler: itemGetRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.ItemChangeRequest]: {
    handler: itemChangeRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.ItemUseRequest]: {
    handler: itemUseRequestHandler,
    protoType: 'common.GamePacket',
  },
  [PACKET_TYPE.ItemDiscardRequest]: {
    handler: itemDiscardRequestHandler,
    protoType: 'common.GamePacket',
  },
  /*-------------------------장재영 작업--------------------------*/
};

export const getHandlerByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    return false;
  }

  return handlers[packetType].handler;
};

export const getProtoTypeByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    return false;
  }

  return handlers[packetType].protoType;
};
