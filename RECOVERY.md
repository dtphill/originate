# Recovery verification — 22 October 2026

Recovered from https://galaxias-media.dtpgames.com/ without changing the live site.

- All 14 public files compared byte-for-byte with fresh live HTTP responses using `python3 scripts/verify.py --live`: passed.
- Nine MP3 files parsed by ffprobe; durations agree with the page within MP3 frame padding.
- Both PDFs have valid PDF signatures and returned HTTP 200 when served locally.
- Chromium local smoke check: each of the nine tracks advances playback; pause works; original Google Drive URL is preserved; artwork loads; no page JavaScript errors; no horizontal overflow at 375px viewport width.
- External and inline JavaScript syntax checks passed with Node.
- `git diff --check`: passed.

Original repository main: `29c8df40dbdd179b8bc131a6524fec9357f540f4` (README only). Visibility: public. Restoration branch: `restore/galaxias-media-source`.

Cloudflare read-only project inspection: no Git source connection, no Functions; current production deployment `34c466c2-515b-4a9d-9cfa-cca9b067a7f0` was uploaded ad hoc. GitHub reported no Actions workflows, existing check runs or deployments. GitHub Pages returned 404. Listing repository webhooks was unavailable (HTTP 403: Resource not accessible by integration); no permissions were added. The restoration therefore leaves main unchanged.

No referenced static assets are missing. The film remains external on Google Drive as designed. Historical upload configuration files are not recoverable from public responses and were not invented.
