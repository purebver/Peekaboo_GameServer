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
  [PACKET_TYPE.ConnectResponse]: 'connectResponse',
  [PACKET_TYPE.ConnectGameRequest]: 'connectGameRequest',
  [PACKET_TYPE.ConnectGameResponse]: 'connectGameResponse',
  [PACKET_TYPE.ConnectNewPlayerNotification]: 'connectNewPlayerNotification',
  [PACKET_TYPE.SpawnInitialGhostRequest]: 'spawnInitialGhostRequest',
  [PACKET_TYPE.StartGameNotification]: 'startGameNotification',
  [PACKET_TYPE.DisconnectPlayerNotification]: 'disconnectPlayerNotification',
};
