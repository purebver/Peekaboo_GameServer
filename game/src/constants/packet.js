import { PACKET_TYPE } from './header.js';

export const packetNames = {
  common: {
    GamePacket: 'common.GamePacket',
  },
};

export const PACKET_MAPS = {
  [PACKET_TYPE.PlayerMoveRequest]: 'playerMoveRequest',
  [PACKET_TYPE.PlayerMoveNotification]: 'playerMoveNotification',
  [PACKET_TYPE.GhostMoveRequest]: 'ghostMoveRequest',
  [PACKET_TYPE.GhostMoveNotification]: 'ghostMoveNotification',
  [PACKET_TYPE.PingRequest]: 'pingRequest', // S2C
  [PACKET_TYPE.PingResponse]: 'pingResponse', // C2S
  [PACKET_TYPE.PlayerStateChangeRequest]: 'playerStateChangeRequest',
  [PACKET_TYPE.PlayerStateChangeNotification]: 'playerStateChangeNotification',
  [PACKET_TYPE.GhostStateChangeRequest]: 'ghostStateChangeRequest',
  [PACKET_TYPE.GhostStateChangeNotification]: 'ghostStateChangeNotification',
  [PACKET_TYPE.ItemChangeRequest]: 'itemChangeNotification',
  [PACKET_TYPE.LoginRequest]: 'loginRequest',
  [PACKET_TYPE.LoginResponse]: 'loginResponse',
  [PACKET_TYPE.CreateRoomRequest]: 'createRoomRequest',
  [PACKET_TYPE.CreateRoomResponse]: 'createRoomResponse',
  [PACKET_TYPE.JoinRoomRequest]: 'joinRoomRequest',
  [PACKET_TYPE.JoinRoomResponse]: 'joinRoomResponse',
  [PACKET_TYPE.joinRoomNotification]: 'joinRoomNotification',
  [PACKET_TYPE.StartStageRequest]: 'startStageRequest',
  [PACKET_TYPE.SpawnInitialDataRequest]: 'spawnInitialDataRequest',
  [PACKET_TYPE.SpawnInitialDataResponse]: 'spawnInitialDataResponse',
  [PACKET_TYPE.StartStageNotification]: 'startStageNotification',
  [PACKET_TYPE.PlayerAttackedRequest]: 'playerAttackedRequest',
  [PACKET_TYPE.PlayerLifeResponse]: 'playerLifeResponse',
  [PACKET_TYPE.GhostAttackedRequest]: 'ghostAttackedRequest',
  [PACKET_TYPE.ItemGetRequest]: 'itemGetRequest',
  [PACKET_TYPE.ItemGetResponse]: 'itemGetResponse',
  [PACKET_TYPE.ItemUseRequest]: 'itemUseRequest',
  [PACKET_TYPE.ItemUseResponse]: 'itemUseResponse',
  [PACKET_TYPE.ItemUseNotification]: 'itemUseNotification',
  [PACKET_TYPE.ItemDiscardRequest]: 'itemDiscardRequest',
  [PACKET_TYPE.ItemDiscardResponse]: 'itemDiscardResponse',
  [PACKET_TYPE.ItemDiscardNotification]: 'itemDiscardNotification',
  [PACKET_TYPE.DoorToggleRequest]: 'doorToggleRequest',
  [PACKET_TYPE.DoorToggleNotification]: 'doorToggleNotification',
  [PACKET_TYPE.StageEndNotification]: 'stageEndNotification',
  [PACKET_TYPE.ExtractSoulRequest]: 'extractSoulRequest',
  [PACKET_TYPE.ExtractSoulNotification]: 'extractSoulNotification',
  [PACKET_TYPE.DisconnectPlayerNotification]: 'disconnectPlayerNotification',
  [PACKET_TYPE.ItemDeleteNotification]: 'itemDeleteNotification',
  [PACKET_TYPE.ItemDisuseRequest]: 'itemDisuseRequest',
  [PACKET_TYPE.ItemDisuseNotification]: 'itemDisuseNotification',
};
