import CustomError from '../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../Error/error.codes.js';
import { handleError } from '../../Error/error.handler.js';
import { getUserBySocket } from '../../sessions/user.sessions.js';

// 유저로부터 핑을 받으면 호출되도록 함
export const pingHandler = ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
    }

    user.receivePing(payload);
  } catch (e) {
    handleError(e);
  }
};
