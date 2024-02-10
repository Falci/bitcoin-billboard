import crypto from 'node:crypto';
import * as bitcoinMessage from 'bitcoinjs-message';

export async function validateBitcoinSignature(
  address: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    return bitcoinMessage.verify(message, address, signature);
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
}

interface HashMessageParams {
  message: string;
  author?: string;
  link?: string;
}
export const hashMessage = ({
  message,
  author,
  link,
}: HashMessageParams): string => {
  const hash = crypto.createHash('sha256');
  hash.update([author, link, message].join(''));
  return hash.digest('hex');
};
