import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { PACKET_MAPS } from '../../constants/packet.js';
import { getProtoMessages } from '../../init/load.protos.js';

/**
 * 해당 데이터를 지정된 패킷 형식에 따라 직렬화하여 전송 가능한 버퍼로 반환하는 함수입니다.
 * @param {number} packetType 패킷 타입 responce패킷 타입, notification 패킷 타입
 * @param {object} payloadData 실제로 보낼 데이터
 * @param {number} sequence 패킷 시퀀스 번호 (해당 유저(클라이언트) sequence 번호)
 * @returns
 */
export const serializer = (packetType, payloadData = {}, sequence) => {
  // packet type
  const typeBuffer = Buffer.alloc(config.packet.typeLength);
  typeBuffer.writeUInt16BE(packetType);

  // version length
  const versionLengthBuffer = Buffer.alloc(config.packet.versionLength);
  versionLengthBuffer.writeUint8(config.client.clientVersion.length);

  // version
  const versionString = config.client.clientVersion;
  const versionBuffer = Buffer.from(versionString, 'utf-8');

  // sequence
  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeUInt32BE(sequence);

  // game packet
  const protoMessages = getProtoMessages();
  const gamePacketStructure = protoMessages.common.GamePacket;

  // payload
  const oneOfPayloadData = {};
  oneOfPayloadData[PACKET_MAPS[packetType]] = payloadData;
  const payloadBuffer = gamePacketStructure.encode(oneOfPayloadData).finish();

  // payload length
  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLength);
  payloadLengthBuffer.writeUInt32BE(payloadBuffer.length);

  // Send Logging Test
  // PingRequest, PlayerMoveNotification, GhostMoveNotification는 제외
  if (
    packetType !== PACKET_TYPE.PlayerMoveNotification &&
    packetType !== PACKET_TYPE.GhostMoveNotification &&
    packetType !== PACKET_TYPE.PingRequest &&
    packetType !== PACKET_TYPE.PlayerStateChangeNotification
  )
    console.log(
      `#@!SEND!@# PacketType : ${PACKET_MAPS[packetType]} => Payload ${JSON.stringify(payloadData)}`,
    );
  return Buffer.concat([
    typeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
    payloadBuffer,
  ]);
};
