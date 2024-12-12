import { getProtoMessages } from '../../init/load.protos.js';

const parserPacket = (payload) => {
  const protoMessages = getProtoMessages();

  const packet = protoMessages.common.GamePacket;

  let payloadData;
  try {
    payloadData = packet.decode(payload);
  } catch (e) {
    console.error(e);
  }

  for (const key in payloadData) {
    if (
      payloadData.hasOwnProperty(key) &&
      typeof payloadData[key] === 'object'
    ) {
      return {
        payload: payloadData[key],
      };
    }
  }
};

export default parserPacket;
