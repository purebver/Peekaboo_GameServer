// 각종 상태에 대한 상수를 정의한 파일
export const GLOBAL_FAIL_CODE = {
  NONE: 0,
  UNKNOWN_ERROR: 1,
  INVALID_REQUEST: 2,
  AUTHENTICATION_FAILED: 3,
};

export const USER_STATE = {
  STAY: 0,
  INGAME: 1,
};

export const GAME_SESSION_STATE = {
  PREPARE: 0, // 준비단계
  INPROGRESS: 1, // 진행중
  END: 2, // 종료
};

export const CHARACTER_STATE = {
  CHARACTER_STATE_NONE: 0,
  IDLE: 1,
  MOVE: 2,
  RUN: 3,
  JUMP: 4,
  ATTACK: 5,
  DIED: 6,
  ATTACKED: 7,
  COOLDOWN: 8,
  SHOUT: 9,
  EXIT: 10,
};
