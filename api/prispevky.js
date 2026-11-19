/**
 * /api/prispevky — spoločný stav skrytej stránky /prispevky-7k2m (plán, zverejnené, výsledky, popisky, nápady).
 * GET  ?k=<kľúč>                       → { posts, ideas, videos, meta } (každé {id: {...}})
 * POST ?k=<kľúč> { kind: "post"|"idea"|"video"|"meta", id, data | null }   (null = zmazať)
 *
 * Úložisko: Redis cez REST (Vercel → Storage → Upstash Redis). Env, ktoré Vercel doplní sám:
 * KV_REST_API_URL + KV_REST_API_TOKEN (alebo UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).
 * Kým env chýba, funkcia vracia 501 a stránka si stav drží len v prehliadači.
 */
const KEY = "7k2m";
const HASH = { post: "pp:posts", idea: "pp:ideas", video: "pp:videos", meta: "pp:meta" };

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.end(JSON.stringify(body));
}

function store() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return async (cmd) => {
    const r = await fetch(url, { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify(cmd) });
    if (!r.ok) throw new Error("store " + r.status);
    return (await r.json()).result;
  };
}

function unpack(flat) {
  const out = {};
  if (Array.isArray(flat)) for (let i = 0; i + 1 < flat.length; i += 2) { try { out[flat[i]] = JSON.parse(flat[i + 1]); } catch (e) {} }
  else if (flat && typeof flat === "object") for (const k of Object.keys(flat)) { try { out[k] = typeof flat[k] === "string" ? JSON.parse(flat[k]) : flat[k]; } catch (e) {} }
  return out;
}

module.exports = async function handler(req, res) {
  const k = (req.query && req.query.k) || "";
  if (k !== KEY) return json(res, 404, { error: "not_found" });
  const run = store();
  if (!run) return json(res, 501, { error: "no_store" });
  try {
    if (req.method === "GET") {
      const [posts, ideas, videos, meta] = await Promise.all([run(["HGETALL", HASH.post]), run(["HGETALL", HASH.idea]), run(["HGETALL", HASH.video]), run(["HGETALL", HASH.meta])]);
      return json(res, 200, { posts: unpack(posts), ideas: unpack(ideas), videos: unpack(videos), meta: unpack(meta) });
    }
    if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
      const hash = body && HASH[body.kind];
      const id = body && typeof body.id === "string" ? body.id : "";
      if (!hash || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) return json(res, 400, { error: "bad_request" });
      if (body.data == null) { await run(["HDEL", hash, id]); return json(res, 200, { ok: true }); }
      const val = JSON.stringify(body.data);
      if (val.length > 120000) return json(res, 413, { error: "too_large" });
      await run(["HSET", hash, id, val]);
      return json(res, 200, { ok: true });
    }
    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "method_not_allowed" });
  } catch (e) {
    return json(res, 502, { error: "store_failed" });
  }
};
