import {
  CLIENT_VERSION,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  TCP_HOST,
  TCP_PORT,
  Test_Token,
  UDP_PORT,
} from '../constants/env.js';
import {
  PACKET_TYPE_LENGTH,
  PAYLOAD_LENGTH,
  SEQUENCE_LENGTH,
  VERSION_LENGTH,
} from '../constants/header.js';
import { MAX_PLAYER, MAX_PLAYER_HP, MAX_GHOST_NUM } from '../constants/game.js';

export const config = {
  server: {
    tcpPort: TCP_PORT,
    udpPort: UDP_PORT,
    tcpHost: TCP_HOST,
  },
  client: {
    clientVersion: CLIENT_VERSION,
  },
  packet: {
    typeLength: PACKET_TYPE_LENGTH,
    versionLength: VERSION_LENGTH,
    sequenceLength: SEQUENCE_LENGTH,
    payloadLength: PAYLOAD_LENGTH,
  },
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    user_set: 'USER',
  },
  test: {
    test_token: Test_Token,
  },
  game: {
    max_player: MAX_PLAYER,
    max_player_hp: MAX_PLAYER_HP,
    max_ghost_num: MAX_GHOST_NUM,
  },
};
