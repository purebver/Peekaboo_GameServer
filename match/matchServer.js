import net from 'net';
import { config } from '../game/src/config/config.js';
import parserPacket from '../game/src/utils/packet/parser.packet.js';
import { PACKET_TYPE } from '../game/src/constants/header.js';
import { getInviteCode } from './utils/room/inviteCode.room.js';
import { fork } from 'child_process';

const servers = {};

function createDedicatedServer(userId, inviteCode) {
  const serverProcess = fork('./game/src/server.js', {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
  });

  serverProcess.unref();

  serverProcess.on('message', (address) => {
    if (address) {
      servers[inviteCode] = address;
    }
  });

  serverProcess.on('exit', (code) => {
    console.log(`Game ${gameId} ended with exit code ${code}`);
  });
}

const tcpServer = net.createServer((socket) => {
  socket.buffer = Buffer.alloc(0);

  socket.on('data', async (data) => {
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

          switch (packetType) {
            case PACKET_TYPE.CreateRoomRequest: {
              const { userId, token } = payload;
              // ------------ TODO: token 검증 ---------------

              //게임 서버 생성
              const inviteCode = getInviteCode();
              createDedicatedServer(userId, inviteCode);

              //서버 연결 로직 추가
              break;
            }
            case PACKET_TYPE.JoinRoomRequest: {
              const { userId, inviteCode } = payload;
              const address = servers[inviteCode];
              if (!address) {
                return;
              }

              //서버 연결 로직 추가
              break;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  });
});

try {
  tcpServer.listen(6666, config.server.tcpHost, () => {
    console.log(`새로운 게임이 포트 ${tcpServer.address().port}에 생성`);
    console.log(tcpServer.address());
  });
} catch (e) {
  console.error(err);
  process.exit(1);
}
