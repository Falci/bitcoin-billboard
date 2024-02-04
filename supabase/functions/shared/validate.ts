import * as crypto from "https://deno.land/std/node/crypto.ts";
import * as bsv from "https://deno.land/x/bsv/mod.ts";

export async function validateBitcoinSignature(
  bitcoinAddress: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    // Step 1: Decode the Bitcoin address
    const decodedAddress = bsv.Address.fromString(bitcoinAddress);

    // Step 2: Create a Bitcoin ECDSA public key from the address
    const publicKey = bsv.PublicKey.fromAddress(decodedAddress);

    // Step 3: Verify the signature using the public key and message
    return crypto.verify(
      "sha256",
      Buffer.from(message),
      {
        key: publicKey.toBuffer(),
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        passphrase: "",
      },
      Buffer.from(signature, "base64")
    );
  } catch (error) {
    console.error("Error validating signature:", error);
    return false;
  }
}