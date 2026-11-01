# Reel covers and related photo services

Standalone localized /ko/reels-cover/, /en/reels-cover/, /ja/reels-cover/ pages with canonical language links, sitemap and original step-by-step/FAQ content. Local images or MP4/WebM/MOV (browser-codec dependent) can be used; video selection requires a decoded seek target before a still frame is extracted. Up to three title layers support drag placement, size/color/font/style, plus image pan/zoom. Preview guides are DOM-only overlays and are never baked into exports. Output is 1080×1920 or a centered 1080×1440 PNG/JPG. This produces static covers, not edited videos.

Inputs stay local; media URLs are revoked on replacement/reset/unmount. Existing image limits apply; videos are bounded to 150MiB, 30 minutes and 16MP. Metadata/codec failures are recoverable. Only allowlisted cover_download format/preset fields are eligible for consent-based analytics.

Entry and localized footers link to https://360photo.kr/ and https://aiphotobooth.kr/ as relevant services. WordPress HTML block and instructions are packaged separately; those sites have not been edited automatically.

Reference read: https://www.instablank.com/reelscover (2026-10-31). Features were reviewed from public HTML; copy, code, backgrounds and layouts were independently created. Crop/UI guides are approximate across apps and devices.

Deployment adds only media-src 'self' blob: to the existing managed MakeSNS Nginx CSP when necessary, preserving other directives and backing up the config. Nginx syntax and effective response headers are checked. Any static or configuration failure restores both the previous site and MakeSNS config. CRM, PM2, database and certificates are not edited.
