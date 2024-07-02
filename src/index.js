import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { crateFolderIfNotExist } from './utils/createFolderIfNotExist.js';

const bootstrap = async () => {
  await initMongoConnection();
  await crateFolderIfNotExist(TEMP_UPLOAD_DIR);
  await crateFolderIfNotExist(UPLOAD_DIR);
  setupServer();
};

bootstrap();
