import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { PACKET_MAPS } from '../constants/packet.js';
import { getHandlerByPacketType } from '../handlers/index.js';
import parserPacket from '../utils/packet/parser.packet.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (
    socket.buffer.length >=
    config.packet.typeLength + config.packet.versionLength
  ) {
    let offset = 0;
    const packetType = socket.buffer.readUint16BE(offset);
    offset += config.packet.typeLength;

    const versionLength = socket.buffer.readUint8(offset);
    offset += config.packet.versionLength;

    const totalHeaderLength =
      config.packet.typeLength +
      config.packet.versionLength +
      versionLength +
      config.packet.sequenceLength +
      config.packet.payloadLength;

    if (socket.buffer.length < totalHeaderLength) {
      break;
    }

    const version = socket.buffer
      .subarray(offset, offset + versionLength)
      .toString('utf-8');
    offset += versionLength;

    if (version !== config.client.clientVersion) {
      console.error(`버전 에러: ${version}`);
    }

    const sequence = socket.buffer.readUint32BE(offset);
    offset += config.packet.sequenceLength;

    const payloadLength = socket.buffer.readUint32BE(offset);
    offset += config.packet.payloadLength;

    const totalPacketLength = totalHeaderLength + payloadLength;
    if (socket.buffer.length < totalPacketLength) {
      break;
    } else {
      const payloadBuffer = socket.buffer.subarray(
        offset,
        offset + payloadLength,
      );
      offset += payloadLength;

      try {
        const { payload } = parserPacket(payloadBuffer);
        socket.buffer = socket.buffer.subarray(offset);

        // Recv Logging Test
        // PingResponse, PlayerMoveRequest, GhostMoveRequest는 제외
        if (
          packetType !== PACKET_TYPE.PlayerMoveRequest &&
          packetType !== PACKET_TYPE.GhostMoveRequest &&
          packetType !== PACKET_TYPE.PingResponse &&
          packetType !== PACKET_TYPE.PlayerStateChangeRequest
        )
          console.log(
            `#@!RECV!@# PacketType : ${PACKET_MAPS[packetType]} => Payload ${JSON.stringify(payload)}`,
          );

        const handler = getHandlerByPacketType(packetType);
        await handler({ socket, payload });
      } catch (e) {
        console.error(e);
      }
    }
  }
};
