#!/usr/bin/env python3
"""Lokálny server s čistými URL: /komunita, /bonusy, /bonusy/hypo-kalkulacka, …"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse
import os

ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", "3000"))

ROUTES = {
    "/": "index.html",
    "/komunita": "komunita.html",
    "/bonusy": "bonusy.html",
    "/gdpr": "gdpr.html",
    "/404": "404.html",
}

HTML_REDIRECTS = {
    "/index.html": "/",
    "/konzultaciajsmentor.html": "/",
    "/komunita.html": "/komunita",
    "/bonusy.html": "/bonusy",
    "/gdpr.html": "/gdpr",
    "/404.html": "/404",
}

ASSET_SUFFIXES = {
    ".css",
    ".js",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".map",
    ".json",
}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _clean_path(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if path != "/" and path.endswith("/"):
            path = path[:-1]
        return path, parsed.query

    def _redirect_target(self, path):
        if path in HTML_REDIRECTS:
            return HTML_REDIRECTS[path]
        if path.startswith("/bonusy-") and path.endswith(".html"):
            slug = path[len("/bonusy-") : -len(".html")]
            if slug:
                return f"/bonusy/{slug}"
        return None

    def _map_file(self, path):
        if path in ROUTES:
            return ROOT / ROUTES[path], path in ("/404",)

        if path.startswith("/bonusy/") and path != "/bonusy":
            slug = path[len("/bonusy/") :]
            candidate = ROOT / f"bonusy-{slug}.html"
            if candidate.is_file():
                return candidate, False

        rel = path.lstrip("/")
        candidate = ROOT / rel
        if candidate.is_file():
            return candidate, False

        html = ROOT / f"{rel}.html"
        if html.is_file():
            return html, False

        return ROOT / "404.html", True

    def _send_redirect(self, location, query):
        if query:
            location = location + "?" + query
        self.send_response(301)
        self.send_header("Location", location)
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()

    def do_GET(self):
        path, query = self._clean_path()
        redirect = self._redirect_target(path)
        if redirect:
            self._send_redirect(redirect, query)
            return

        mapped, is_404 = self._map_file(path)
        self.path = "/" + mapped.relative_to(ROOT).as_posix()
        if query:
            self.path += "?" + query
        if is_404:
            suffix = Path(path).suffix.lower()
            if suffix in ASSET_SUFFIXES:
                self.send_error(404, "File not found")
                return
            self.send_response(404)
            try:
                data = mapped.read_bytes()
            except OSError:
                data = b"404"
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(data)
            return
        return super().do_GET()

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"JS Mentor: http://127.0.0.1:{PORT}/")
    print(f"  /komunita  /bonusy  /gdpr")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
