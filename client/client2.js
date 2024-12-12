// 더미 테스트를 위한 클라이언트
import { PACKET_TYPE } from '../game/src/constants/header.js';
import { loadProtos } from '../game/src/init/load.protos.js';
import Client, { CLIENTTYPE } from './client.class.js';

loadProtos();

const client = new Client();

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

client.gameServerConnect();

// 방 생성 요청
let data = '2';

// 로그인 처리 후 send
client.sendPacket(data, CLIENTTYPE.GAMECLIENT);
