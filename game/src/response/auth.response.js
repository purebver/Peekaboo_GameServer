import {
  GLOBAL_FAIL_CODE,
  USER_STATE,
  GAME_SESSION_STATE,
} from '../constants/state.js';
import { serializer } from '../utils/packet/create.packet.js';
import { PACKET_TYPE } from '../constants/header.js';

/**
 * 토큰이 유효하지 않을때 실패 응답 보내주는 함수입니다.
 * @param {*} socket
 */
export const invalidTokenResponse = (socket) => {
  const data = {
    gameId: null,
    hostId: null,
    existUserIds: null,
    ghostTypeIds: null, // 임시 고스트 타입
    gloalFailCode: GLOBAL_FAIL_CODE.INVALID_REQUEST,
    userState: USER_STATE.STAY,
    gameSessionState: GAME_SESSION_STATE.PREPARE,
    message: '해당 토큰이 일치하지 않아 게임을 입장할 수 없습니다.',
  };
  const responseData = serializer(PACKET_TYPE.ConnectGameResponse, data, 0); // sequence도 임시로
  socket.write(responseData);
};

/**
 * 호스트에게 게임 초기 정보를 응답으로 보내주는 함수입니다.
 * @param {*} socket
 * @param {*} gameSession
 */
export const sendConnectGameResponse = (socket, gameSession, existUserIds) => {
  const data = {
    gameId: gameSession.id,
    hostId: gameSession.hostId,
    existUserIds: existUserIds,
    ghostTypeIds: [1, 2, 3, 4, 5], // 임시 고스트 타입 5마리 소환하라고 보냅니다.
    gloalFailCode: GLOBAL_FAIL_CODE.NONE,
    userState: USER_STATE.INGAME,
    gameSessionState: gameSession.state,
    message: '게임 세션 입장에 성공하였습니다.',
  };
  const responseData = serializer(PACKET_TYPE.ConnectGameResponse, data, 0); // sequence도 임시로
  socket.write(responseData);
};
