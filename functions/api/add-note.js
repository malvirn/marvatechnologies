import { verifyCredentials, publishNote } from "../../src/lib/notes-api.mjs";

const headers = { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });

export async function onRequestPost({ request, env }) {
  let data;
  try { data = await request.json(); } catch { return reply({ ok: false, error: "Bad request." }, 400); }
  if (!(await verifyCredentials(env, data.username, data.password))) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // slow down guessing
    return reply({ ok: false, error: "Wrong username or password." }, 401);
  }
  if (data.action === "login") return reply({ ok: true });
  if (data.action === "publish") {
    const result = await publishNote({ env, note: data.note });
    return reply(result.body, result.status);
  }
  return reply({ ok: false, error: "Unknown action." }, 400);
}

export const onRequest = () => reply({ ok: false, error: "Method not allowed." }, 405);
