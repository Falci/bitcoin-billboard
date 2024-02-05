import * as bitcoinMessage from 'npm:bitcoinjs-message';

export async function validateBitcoinSignature(
  address: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    return bitcoinMessage.verify(message, address, signature);
  } catch (error) {
    console.error("Error validating signature:", error);
    return false;
  }
}