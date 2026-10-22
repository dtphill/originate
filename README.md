# Galaxias — film and sound

The existing supporting media website for David Phillips' Originate Games application: https://galaxias-media.dtpgames.com/.

## Recovered source

`public/` is the complete static website, recovered byte-for-byte from the public live site on 22 October 2026. HTML, inline CSS and film JavaScript remain in `index.html`; the excerpt player is in `audio-player.js`. No build step, package installation, application backend or credentials are needed to serve it.

The 14 public files include nine MP3 excerpts, the original development-reel PNG artwork, and two PDFs:

| Label | File in `public/media/audio/` |
| --- | --- |
| Rain | `rain.mp3` |
| Frog | `frog.mp3` |
| Flood | `flood.mp3` |
| Fluvial | `piano-drone.mp3` |
| Storm | `sleep.mp3` |
| Between the Rocks | `live-dub-tech-jam.mp3` |
| Murk | `hadal.mp3` |
| Tiny Legs | `chalk-1.mp3` |
| Mechano-receptors | `10c.mp3` |

Documents: `public/documents/Galaxias_Originate_Documentation.pdf` and `public/documents/DPhillips_Originate_CV.pdf`. Artwork: `public/media/galaxias-development-reel.png`.

The film remains linked to its existing Google Drive viewing URL in the `film-settings` JSON. The video itself is intentionally external and is not missing from this static snapshot. Media ownership remains with its respective owner; this restoration does not add a licence.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open http://127.0.0.1:8000/. Keep the relative directory structure intact.

## Verify the recovery

```sh
python3 scripts/verify.py
python3 scripts/verify.py --live
```

The first command checks the complete inventory, byte sizes and SHA-256 hashes in `recovery-manifest.json`. The optional second command uses `curl` to compare all 14 files to current live responses. A later intentional live edit will cause that comparison to fail; the manifest records the recovered snapshot, not future changes.

## Hosting and deployment

The deployable artifact is exactly the contents of `public/`, with `index.html` at the hosting root. Any ordinary static HTTP server can serve it directly. No compilation, environment variables or Functions are required. Do not publish the repository root in place of `public/`.

Read-only checks on 22 October 2026 confirmed the existing Cloudflare Pages project is `galaxias-media`, has no Git source connection, uses no Functions, and has production branch metadata `main`. Its live production deployment is `34c466c2-515b-4a9d-9cfa-cca9b067a7f0`, uploaded ad hoc on 18 October 2026. The domain is `galaxias-media.dtpgames.com`.

For a separately authorized future Pages upload, use the contents of `public/` as the static upload artifact for the existing project. Preserve the existing domain and project settings. The public site does not expose original deployment-only files (such as any historical `_headers` or `_redirects`), so none have been invented. This repository reproduces the recovered site content, not a backup of the Cloudflare account configuration.

This restoration performs no deployment and adds no CI, deploy hooks or Cloudflare configuration. GitHub reported no Actions workflows, check runs or deployment history; the Pages API returned 404. Repository webhook inspection returned HTTP 403 with the existing integration permissions, so the restored source is on `restore/galaxias-media-source`, leaving `main` unchanged. Review publishing integrations again before any future merge or deployment.
