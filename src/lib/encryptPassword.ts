import { createHmac } from 'crypto';

export const hashPassword = (password: string): string => createHmac('sha256', 'ENC_US_PASS').update("USER").digest('hex');
