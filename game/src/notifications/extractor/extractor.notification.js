import { PACKET_TYPE } from '../../constants/header.js';
import { serializer } from '../../utils/packet/create.packet.js';

export const extractSoulNotification = (gameSession, soulAccumulatedAmount) => {
  // 해당 게임 세션에 참여한 유저들에게 notification 보내주기
  gameSession.users.forEach((user) => {
    const responseData = serializer(
      PACKET_TYPE.ExtractSoulNotification,
      { soulAccumulatedAmount: soulAccumulatedAmount },
      user.socket.sequence++,
    );
    user.socket.write(responseData);
  });
};
