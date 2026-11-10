/**
 * POST /api/novinky — prihlásenie na novinky zo stránok typu „Týždeň v grafoch“ (stačí e-mail).
 * Kontakt ide do Ecomailu so štítkom „tyzden-v-grafoch“.
 * Env vo Verceli: ECOMAIL_API_KEY (spoločný s /api/join), ECOMAIL_NOVINKY_LIST_ID
 * (ak chýba, použije sa ECOMAIL_LIST_ID), voliteľne ECOMAIL_NOVINKY_TAG.
 *
 * Ochrana dát v Ecomaile: existujúcemu kontaktu sa štítky nikdy neprepíšu. Najprv si prečítame,
 * aké má, a pošleme ich spolu s novým; ak sa prečítať nedajú, štítky neposielame vôbec.
 * Automatizácie sa spúšťajú len vtedy, keď majú novinky vlastný zoznam (ECOMAIL_NOVINKY_LIST_ID),
 * aby prihlásenie na novinky nespustilo automatizáciu spoločného zoznamu.
 */
const ECOMAIL_BASE = "https://api2.ecomailapp.cz";
const DEFAULT_TAG = "tyzden-v-grafoch";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function clean(value, max) {
  return String(value == null ? "" : value).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

/** Zistí, či kontakt v zozname už je a aké má štítky. tags === null znamená „nevieme“. */
async function lookup(listId, email, apiKey) {
  try {
    const r = await fetch(`${ECOMAIL_BASE}/lists/${listId}/subscriber/${encodeURIComponent(email)}`, { headers: { key: apiKey } });
    if (!r.ok) return { exists: false, tags: null };
    const d = await r.json().catch(() => null);
    const s = d && typeof d === "object" ? d.subscriber || d : null;
    if (!s || typeof s !== "object" || !s.email) return { exists: false, tags: null };
    return { exists: true, tags: Array.isArray(s.tags) ? s.tags.filter((t) => typeof t === "string" && t) : null };
  } catch {
    return { exists: false, tags: null };
  }
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ECOMAIL_API_KEY;
  const ownList = process.env.ECOMAIL_NOVINKY_LIST_ID;
  const listId = ownList || process.env.ECOMAIL_LIST_ID;
  const tag = clean(process.env.ECOMAIL_NOVINKY_TAG || DEFAULT_TAG, 60) || DEFAULT_TAG;
  if (!apiKey || !listId) {
    json(res, 500, { ok: false, error: "Ecomail is not configured" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      json(res, 400, { ok: false, error: "Invalid JSON" });
      return;
    }
  }
  if (!body || typeof body !== "object") {
    json(res, 400, { ok: false, error: "Invalid body" });
    return;
  }

  // pasca na roboty: skryté pole musí ostať prázdne
  if (clean(body.website, 10)) {
    json(res, 200, { ok: true });
    return;
  }

  const email = clean(body.email, 254).toLowerCase();
  if (!isValidEmail(email)) {
    json(res, 400, { ok: false, error: "Invalid email" });
    return;
  }

  const found = await lookup(listId, email, apiKey);
  const subscriber = { email };
  let updateExisting = false;
  if (found.exists) {
    // kontakt už v zozname je: nič mu neprepisujeme, štítok len pridáme k tým, čo má
    updateExisting = true;
    if (found.tags) subscriber.tags = Array.from(new Set(found.tags.concat(tag)));
  } else {
    subscriber.tags = [tag];
  }

  const payload = {
    subscriber_data: subscriber,
    trigger_autoresponders: Boolean(ownList),
    update_existing: updateExisting,
    resubscribe: true,
    skip_confirmation: true,
  };

  try {
    const response = await fetch(`${ECOMAIL_BASE}/lists/${listId}/subscribe`, {
      method: "POST",
      headers: { key: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Ecomail novinky subscribe failed", response.status, JSON.stringify(data).slice(0, 500));
      json(res, 502, { ok: false, error: "Ecomail request failed" });
      return;
    }
    json(res, 200, { ok: true });
  } catch (error) {
    console.error("Ecomail novinky subscribe error", error instanceof Error ? error.message : String(error));
    json(res, 502, { ok: false, error: "Ecomail request failed" });
  }
};
