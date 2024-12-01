// 더미 테스트를 위한 클라이언트
import { PACKET_TYPE } from '../game/src/constants/header.js';
import { loadProtos } from '../game/src/init/load.protos.js';
import Client, { CLIENTTYPE } from './client.class.js';

loadProtos();

const client = new Client();

// -------------------------------로비서버 요청---------------------------

// 로그인 요청
setTimeout(() => {
  const data = {
    id: 'test1',
    password: '1234',
  };

  client.sendPacket(PACKET_TYPE.LoginRequest, data, CLIENTTYPE.GATECLIENT);
}, 1000);

// --------------------------게임 서버 연결----------------------------

setTimeout(() => {
  client.gameServerConnect();
}, 2000);

// ------------------------------게임 서버 요청----------------------------

// 방 생성 요청
setTimeout(() => {
  const data = {
    userId: client.userId,
    token: client.token,
  };

  // 로그인 처리 후 send
  client.sendPacket(PACKET_TYPE.CreateRoomRequest, data, CLIENTTYPE.GAMECLIENT);
}, 3000);

// 방 참가 요청
// setTimeout(() => {
//   const data = {
//     userId: client.userId,
//     inviteCode: 'PF1XYBO1LB', // inviteCode는 수시로 변경해줘야 테스트 가능
//     token: client.token,
//   };

//   // 로그인 처리 후 send
//   client.sendPacket(
//     PACKET_TYPE.JoinRoomRequest,
//     data,
//     CLIENTTYPE.GAMECLIENT,
//   );
// }, 3000);

let x = 0;
let y = 0;
let z = 0;

// 움직임 요청
setTimeout(() => {
  setInterval(() => {
    const playerMoveInfo = {
      userId: client.userId,
      position: client.position.getPosition(),
      rotation: client.rotation.getRotation(),
    };

    const data = {
      playerMoveInfo,
    };

    client.position.updatePosition(x++, y++, z++);
    client.rotation.updateRotation(x++, y++, z++);

    client.sendPacket(
      PACKET_TYPE.PlayerMoveRequest,
      data,
      CLIENTTYPE.GAMECLIENT,
    );
  }, 1000);
}, 4000);
