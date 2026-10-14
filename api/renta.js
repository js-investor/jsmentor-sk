/**
 * POST /api/renta — pridá kontakt z formulára na /renta do Ecomail zoznamu kurzu
 * so štítkom „renta-kurz“ (automatizácia v Ecomaile potom pošle mail s odkazom na kurz).
 * Env vo Verceli: ECOMAIL_API_KEY (spoločný s /api/join), ECOMAIL_RENTA_LIST_ID
 * (ak chýba, použije sa ECOMAIL_LIST_ID), voliteľne ECOMAIL_RENTA_TAG (predvolené „renta-kurz“).
 */
const ECOMAIL_BASE = "https://api2.ecomailapp.cz";
const DEFAULT_TAG = "renta-kurz";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value, max) {
  return String(value == null ? "" : value).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
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
  const listId = process.env.ECOMAIL_RENTA_LIST_ID || process.env.ECOMAIL_LIST_ID;
  const tag = clean(process.env.ECOMAIL_RENTA_TAG || DEFAULT_TAG, 60) || DEFAULT_TAG;
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

  const fullName = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  if (!fullName || !isValidEmail(email)) {
    json(res, 400, { ok: false, error: "Invalid name or email" });
    return;
  }
  const parts = fullName.split(/\s+/);
  const firstName = parts.shift();
  const surname = parts.join(" ");

  // posielame len meno, priezvisko, e-mail a štítok; vlastné polia (zdroj, UTM) by museli v zozname existovať
  const subscriber = { name: firstName, email, tags: [tag] };
  if (surname) subscriber.surname = surname;

  const payload = {
    subscriber_data: subscriber,
    trigger_autoresponders: true,
    update_existing: true,
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
      console.error("Ecomail renta subscribe failed", response.status, JSON.stringify(data).slice(0, 500));
      json(res, 502, { ok: false, error: "Ecomail request failed" });
      return;
    }
    json(res, 200, { ok: true });
  } catch (error) {
    console.error("Ecomail renta subscribe error", error instanceof Error ? error.message : String(error));
    json(res, 502, { ok: false, error: "Ecomail request failed" });
  }
};
