export const TOTAL_HEADER_LENGTH_EXCEPT_VERSION = 11;
export const PACKET_TYPE_LENGTH = 2;
export const VERSION_LENGTH = 1;
export const SEQUENCE_LENGTH = 4;
export const PAYLOAD_LENGTH = 4;

export const PACKET_TYPE = {
  PlayerMoveRequest: 1,
  PlayerMoveNotification: 2,
  GhostMoveRequest: 3,
  GhostMoveNotification: 4,
  PingRequest: 5, // S2C
  PingResponse: 6, // C2S
  PlayerStateChangeRequest: 7,
  PlayerStateChangeNotification: 8,
  GhostStateChangeRequest: 9,
  GhostStateChangeNotification: 10,
  ItemChangeRequest: 11,
  ItemChangeNotification: 12,
  LoginRequest: 16,
  LoginResponse: 17,
  CreateRoomRequest: 18,
  CreateRoomResponse: 19,
  JoinRoomRequest: 20,
  JoinRoomResponse: 21,
  JoinRoomNotification: 22,
  StartStageRequest: 23,
  SpawnInitialDataRequest: 24,
  SpawnInitialDataResponse: 25,
  StartStageNotification: 26,
  PlayerAttackedRequest: 27,
  PlayerLifeResponse: 28,
  GhostAttackedRequest: 29,
  ItemGetRequest: 30,
  ItemGetResponse: 31,
  ItemUseRequest: 32,
  ItemUseResponse: 33,
  ItemUseNotification: 34,
  ItemDiscardRequest: 35,
  ItemDiscardResponse: 36,
  ItemDiscardNotification: 37,
  DoorToggleRequest: 38,
  DoorToggleNotification: 39,
  StageEndNotification: 40,
  ExtractSoulRequest: 41,
  ExtractSoulNotification: 42,
  disconnectPlayerNotification: 43,
};
