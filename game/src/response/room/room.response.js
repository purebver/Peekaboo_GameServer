import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { GLOBAL_FAIL_CODE } from '../../constants/state.js';
import { serializer } from '../../utils/packet/create.packet.js';

/**
 * 토큰이 유효하지 않을때 실패 응답 보내주는 함수입니다.
 * @param {*} socket
 */
export const sendCreateRoomResponse = (socket, game) => {
  const data = {
    globalFailCode: GLOBAL_FAIL_CODE.NONE,
    message: '방이 성공적으로 생성되었습니다.',
    gameSessionId: game.id,
    inviteCode: game.inviteCode, // 임시 고스트 타입
  };
  const responseData = serializer(
    PACKET_TYPE.CreateRoomResponse,
    data,
    socket.sequence++,
  ); // sequence도 임시로
  socket.write(responseData);
};

export const sendJoinRoomResponse = (socket, game) => {
  const players = game.users.map((user) => {
    const userId = user.id;
    const moveInfo = {
      position: user.character.position.getPosition(),
      rotation: user.character.rotation.getRotation(),
    };
    const isHost = game.hostId === userId ? true : false;
    return {
      userId,
      moveInfo,
      isHost,
    };
  });
  const data = {
    globalFailCode: GLOBAL_FAIL_CODE.NONE,
    message: '방에 성공적으로 참가하였습니다.',
    gameSessionId: game.id,
    playerInfos: players,
  };

  const responseData = serializer(
    PACKET_TYPE.JoinRoomResponse,
    data,
    socket.sequence++,
  ); // sequence도 임시로

  console.log(`joinRoomResponse => ${JSON.stringify(data)}`);

  socket.write(responseData);
};
