import initServer from './init/index.js';
import net from 'net';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';

const inviteCode = process.env.INVITE_CODE;

const tcpServer = net.createServer(onConnection);

//포트번호를 0으로 하면 자동으로 번호를 동적 할당
initServer()
  .then(() => {
    tcpServer.listen(3000, config.server.tcpHost, () => {
      console.log(`새로운 게임이 포트 ${tcpServer.address().port}에 생성`);
      console.log(tcpServer.address());

      const roomServer = net.connect(
        { host: 'host.docker.internal', port: 6666 },
        () => {
          console.log('발송');
          roomServer.write(
            JSON.stringify(`${inviteCode}:${tcpServer.address().port}`),
          );
        },
      );
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
