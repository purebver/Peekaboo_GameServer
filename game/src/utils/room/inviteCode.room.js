import { config } from '../../config/config.js';
import crypto from 'crypto';

export const getInviteCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const inviteCodeLength = config.game.invite_code_length;
  const randomBytes = crypto.randomBytes(inviteCodeLength);

  let inviteCode = '';

  for (let i = 0; i < inviteCodeLength; i++) {
    const index = randomBytes[i] % characters.length;
    inviteCode += characters[index];
  }

  return inviteCode;
};
