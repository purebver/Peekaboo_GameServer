// 더미 테스트를 위한 클라이언트
import { PACKET_TYPE } from '../game/src/constants/header.js';
import { loadProtos } from '../game/src/init/load.protos.js';
import Client, { CLIENTTYPE } from './client.class.js';

loadProtos();

const client = new Client();

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// -------------------------------로비서버 요청---------------------------

// 로그인 요청
// setTimeout(() => {
//   const data = {
//     id: 'test1',
//     password: '1234',
//   };

//   client.sendPacket(PACKET_TYPE.LoginRequest, data, CLIENTTYPE.GATECLIENT);
// }, 1000);

// --------------------------게임 서버 연결----------------------------

client.gameServerConnect();

// ------------------------------게임 서버 요청----------------------------

// 방 생성 요청
await delay(1000);
let data = {
  userId: '나는클라이언트1',
  token: '토큰인가',
};
client.host = true;

// 로그인 처리 후 send
client.sendPacket(PACKET_TYPE.CreateRoomRequest, data, CLIENTTYPE.GAMECLIENT);

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

// 게임 시작 요청
await delay(1000);
data = {
  gameSessionId: client.gameSessionId,
  difficultyId: 'DIF0001',
};
client.sendPacket(PACKET_TYPE.StartStageRequest, data, CLIENTTYPE.GAMECLIENT);

//아이템 획득 요청
await delay(1000);
let i = 1;
while (i < 5) {
  console.log(i);
  const data = {
    itemId: i,
    inventorySlot: 1,
  };

  client.sendPacket(PACKET_TYPE.ItemGetRequest, data, CLIENTTYPE.GAMECLIENT);
  i++;
  await delay(50);
}

// 아이템 사용 요청
await delay(4000);

const useItemdata = {
  inventorySlot: 1,
};

client.sendPacket(
  PACKET_TYPE.ItemUseRequest,
  useItemdata,
  CLIENTTYPE.GAMECLIENT,
);

// 아이템 변경 요청
await delay(2000);

const changeItemdata = {
  inventorySlot: 2,
};

client.sendPacket(
  PACKET_TYPE.ItemChangeRequest,
  changeItemdata,
  CLIENTTYPE.GAMECLIENT,
);

await delay(2000);

const DiscardItemdata = {
  itemInfo: {
    itemId: 2,
    itemTypeId: 2,
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  inventorySlot: 2,
};

client.sendPacket(
  PACKET_TYPE.ItemDiscardRequest,
  DiscardItemdata,
  CLIENTTYPE.GAMECLIENT,
);

await delay(2000);

const DisuseItemdata = {
  itemId: 1,
};

client.sendPacket(
  PACKET_TYPE.ItemDisuseRequest,
  DisuseItemdata,
  CLIENTTYPE.GAMECLIENT,
);
