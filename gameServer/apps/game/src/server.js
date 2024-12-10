import initServer from './init/index.js';
import net from 'net';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';

//process.argv[0]: Node.js 실행 경로 (예: C:\Program Files\nodejs\node.exe).
//process.argv[1]: 실행 중인 스크립트 파일 경로 (예: C:\path\to\dedicatedServer.js).
//process.argv[2] 이후: 명령줄에서 추가로 전달된 사용자 정의 인자.

const userId = process.argv[2];
const inviteCode = process.argv[3];

const tcpServer = net.createServer(onConnection);

//포트번호를 0으로 하면 자동으로 번호를 동적 할당
initServer()
  .then(() => {
    tcpServer.listen(0, config.server.tcpHost, () => {
      if (process.send) {
        process.send(tcpServer.address());
      }
      console.log(`새로운 게임이 포트 ${tcpServer.address().port}에 생성`);
      console.log(tcpServer.address());
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
