import { loadServerGameAssets } from './load.assets.js';
import { loadProtos } from './load.protos.js';

const initServer = async () => {
  try {
    await loadServerGameAssets();
    await loadProtos();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;
