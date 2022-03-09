import { createHmac } from 'crypto';

export const hashPassword = (password: string): string => createHmac('sha256', 'GfG').update("USER").digest('hex');
