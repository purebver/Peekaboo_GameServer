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
  StartStageRequest: 22,
  SpawnInitialDataRequest: 23,
  SpawnInitialDataResponse: 24,
  StartStageNotification: 25,
  PlayerAttackedRequest: 26,
  PlayerLifeResponse: 27,
  GhostAttackedRequest: 28,
  ItemGetRequest: 29,
  ItemGetResponse: 30,
  ItemUseRequest: 31,
  ItemUseResponse: 32,
  ItemUseNotification: 33,
  ItemDiscardRequest: 34,
  ItemDiscardResponse: 35,
  ItemDiscardNotification: 36,
  DoorToggleRequest: 37,
  DoorToggleNotification: 38,
  StageEndNotification: 39,
  ExtractSoulRequest: 40,
  ExtractSoulNotification: 41,
  disconnectPlayerNotification: 42,
};
