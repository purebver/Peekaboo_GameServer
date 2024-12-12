import net from 'net';
import { spawn } from 'child_process';

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const servers = {};

async function createDedicatedServer(userId, inviteCode) {
  const containerName = `dedicated-${inviteCode}`;

  try {
    // Docker 컨테이너 실행
    const runProcess = spawn('docker', [
      'run',
      '-d',
      '--rm',
      '--name',
      containerName,
      '--network',
      `network-${inviteCode}`,
      '-e',
      `INVITE_CODE=${inviteCode}`,
      'dedicated-server',
    ]);

    let containerId = '';
    for await (const chunk of runProcess.stdout) {
      containerId += chunk.toString();
    }
    containerId = containerId.trim();
    console.log(`Dedicated server started with ID: ${containerId}`);

    // 컨테이너 정보를 서버 객체에 저장
    servers[inviteCode] = {
      containerId,
      userId,
    };

    console.log('--servers--', servers);

    // Docker 컨테이너 주소 가져오기
    const inspectProcess = spawn('docker', [
      'inspect',
      '-f',
      '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}',
      containerId,
    ]);

    let containerAddress = '';
    for await (const chunk of inspectProcess.stdout) {
      containerAddress += chunk.toString();
    }
    containerAddress = containerAddress.trim();
    console.log(`Container address: ${containerAddress}`);

    // 메시지 전달과 유사하게 컨테이너 주소 저장
    servers[inviteCode].address = containerAddress;

    // 10초 후 컨테이너 종료
    await delay(10000);

    await stopDedicatedServer(inviteCode);
  } catch (error) {
    console.error(`Error managing dedicated server: ${error.message}`);
  }
}

async function stopDedicatedServer(inviteCode) {
  const server = servers[inviteCode];
  if (!server) {
    console.log(`No server found for inviteCode: ${inviteCode}`);
    return;
  }

  const { containerId } = server;
  try {
    // Docker 컨테이너 중지
    const stopProcess = spawn('docker', ['stop', containerId]);

    for await (const chunk of stopProcess.stdout) {
      console.log(chunk.toString());
    }

    console.log(`Server ${inviteCode} stopped.`);
  } catch (error) {
    console.error(`Error stopping server: ${error.message}`);
  }

  // 서버 목록에서 제거
  delete servers[inviteCode];
}

// const tcpServer = net.createServer((socket) => {
//   socket.buffer = Buffer.alloc(0);

//   socket.on('data', async (data) => {
//     socket.buffer = Buffer.concat([socket.buffer, data]);

//     while (
//       socket.buffer.length >=
//       config.packet.typeLength + config.packet.versionLength
//     ) {
//       let offset = 0;
//       const packetType = socket.buffer.readUint16BE(offset);
//       offset += config.packet.typeLength;

//       const versionLength = socket.buffer.readUint8(offset);
//       offset += config.packet.versionLength;

//       const totalHeaderLength =
//         config.packet.typeLength +
//         config.packet.versionLength +
//         versionLength +
//         config.packet.sequenceLength +
//         config.packet.payloadLength;

//       if (socket.buffer.length < totalHeaderLength) {
//         break;
//       }

//       const version = socket.buffer
//         .subarray(offset, offset + versionLength)
//         .toString('utf-8');
//       offset += versionLength;

//       if (version !== config.client.clientVersion) {
//         console.error(`버전 에러: ${version}`);
//       }

//       const sequence = socket.buffer.readUint32BE(offset);
//       offset += config.packet.sequenceLength;

//       const payloadLength = socket.buffer.readUint32BE(offset);
//       offset += config.packet.payloadLength;

//       const totalPacketLength = totalHeaderLength + payloadLength;
//       if (socket.buffer.length < totalPacketLength) {
//         break;
//       } else {
//         const payloadBuffer = socket.buffer.subarray(
//           offset,
//           offset + payloadLength,
//         );
//         offset += payloadLength;

//         try {
//           const { payload } = parserPacket(payloadBuffer);
//           socket.buffer = socket.buffer.subarray(offset);

//           switch (packetType) {
//             case PACKET_TYPE.CreateRoomRequest: {
//               const { userId, token } = payload;
//               // ------------ TODO: token 검증 ---------------

//               //게임 서버 생성
//               const inviteCode = getInviteCode();
//               createDedicatedServer(userId, inviteCode);

//               //생성된 서버에 연결 로직 추가
//               //socket.write로 connectRoomRequest를 송신

//               //연결 후 소켓 종료
//               //종료 시키는게 맞나??????
//               socket.end();
//               break;
//             }
//             case PACKET_TYPE.JoinRoomRequest: {
//               const { userId, inviteCode } = payload;
//               const address = servers[inviteCode];
//               if (!address) {
//                 return;
//               }

//               //address서버에 연결 로직 추가
//               //socket.write로 connectPortRequest를 송신

//               //연결 후 소켓 종료
//               socket.end();
//               break;
//             }
//           }
//         } catch (e) {
//           console.error(e);
//         }
//       }
//     }
//   });
// });

const tcpServer = net.createServer((socket) => {
  socket.buffer = Buffer.alloc(0);

  socket.on('data', async (data) => {
    try {
      socket.buffer = Buffer.concat([socket.buffer, data]);
      const parseData = JSON.parse(data);
      const [a, b] = parseData.split(':');
      console.log(parseData);
      if (a === 'create') {
        createDedicatedServer(1, b);
      } else {
        servers[a].port = b;
        const adr = socket.address().address;
        console.log('------------------------------------', servers);
      }
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('end', (data) => {
    console.log('end');
  });

  socket.on('error', (err) => {
    console.log('Error : ', err);
  });
});

try {
  tcpServer.listen(6666, '0.0.0.0', () => {
    console.log(`roomServer가 ${tcpServer.address().port}에 대기`);
    console.log(tcpServer.address());
  });
} catch (e) {
  console.error(err);
  process.exit(1);
}
