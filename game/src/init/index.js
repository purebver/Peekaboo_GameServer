import { loadProtos } from './load.protos.js';

const initServer = async () => {
  try {
    loadProtos();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;
