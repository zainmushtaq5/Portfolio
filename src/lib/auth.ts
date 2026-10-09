import { createHmac, timingSafeEqual } from "crypto";

export function signSessionPayload(exp: number): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is missing");
  
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  
  try {
    const expectedSignature = createHmac("sha256", secret).update(payload).digest("base64url");
    
    const sigBuf = Buffer.from(signature, "base64url");
    const expSigBuf = Buffer.from(expectedSignature, "base64url");

    if (sigBuf.length !== expSigBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expSigBuf)) return false;

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (!decoded.exp || Date.now() > decoded.exp) return false;

    return true;
  } catch {
    return false;
  }
}
