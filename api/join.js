/**
 * POST /api/join — pridá lead z komunitného formulára do Ecomail zoznamu.
 * Env vo Verceli: ECOMAIL_API_KEY, ECOMAIL_LIST_ID
 */
const ECOMAIL_BASE = "https://api2.ecomailapp.cz";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  const listId = process.env.ECOMAIL_LIST_ID;

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

  const firstName = String(body?.firstName || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!firstName || !email || !isValidEmail(email)) {
    json(res, 400, { ok: false, error: "Invalid firstName or email" });
    return;
  }

  const payload = {
    subscriber_data: {
      name: firstName,
      email,
    },
    trigger_autoresponders: true,
    update_existing: true,
    resubscribe: false,
  };

  try {
    const response = await fetch(`${ECOMAIL_BASE}/lists/${listId}/subscribe`, {
      method: "POST",
      headers: {
        key: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      json(res, 502, {
        ok: false,
        error: "Ecomail request failed",
        details: data,
      });
      return;
    }

    json(res, 200, { ok: true, subscriber: data });
  } catch (error) {
    json(res, 502, {
      ok: false,
      error: "Ecomail request failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
