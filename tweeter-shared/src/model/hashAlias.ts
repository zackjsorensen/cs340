export function hashAlias(username: string): 1 | 2 {
  let hash = 5381;
  for (let i = 0; i < username.length; i++) {
    hash = ((hash << 5) + hash) + username.charCodeAt(i); // hash * 33 + c
    hash |= 0; // keep as 32-bit int
  }
  return (Math.abs(hash) % 2) === 0 ? 1 : 2;
}