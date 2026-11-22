// Usage: node scripts/make-studio-password.mjs "new password"
// Prints the salt and hash to store as NOTES_PASSWORD_SALT and NOTES_PASSWORD_HASH in Cloudflare Pages.
import { randomBytes } from "node:crypto";
import { hashPassword } from "../src/lib/notes-api.mjs";
const password = process.argv[2];
if (!password || password.length < 12) { console.error("Give a password of at least 12 characters."); process.exit(1); }
const salt = randomBytes(16).toString("hex");
console.log("NOTES_PASSWORD_SALT=" + salt);
console.log("NOTES_PASSWORD_HASH=" + (await hashPassword(password, salt)));
