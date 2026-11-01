# Profile completion tools

- Independently edited decoration sets for Korean, English and Japanese, preserving factual bio content and previous sample-draft migration.
- Gallery and editor left/center/right alignment, final copy includes measured spacing, 150 UTF-16-unit conservative budget. If spacing would overflow, original text is retained with a warning. Editable source text is never padded or truncated. Alignment enum is stored with the tab draft; source text and spacing are never sent to analytics.
- Search existing symbols plus a curated emoji/kaomoji/divider selection using Korean/English/Japanese keywords, emoji sequences, kinds, favorites and recent copies. Exact Unicode IDs remain stable, including joined emoji. Results are rendered in bounded batches. Queries are local and not tracked.
- Selected-text framing inside the profile editor. A missing selection produces guidance rather than overwriting the entire bio.
- Optional on-demand profile photo cropper in the profile page. Drag/zoom inside a circular viewport, multiple avatar sizes, preview application, 320/1080 square PNG/JPG or circular transparent PNG export. Existing file-type, byte and pixel limits apply. Image decoding and rendering are local; object URLs are revoked. Photo previews stay in memory and clear when the draft is explicitly cleared; they are not serialized to storage.

Requested reference pages are now accessible and were read. Research record: /workspace/research/profile-reference-2026-10-31/REVIEW.md. Readability and context-relevant emoji guidance were used; original code, personal bios and copyrighted sample copy were not copied. Google search returned a JS interstitial; no search-result findings are attributed to it. Some older articles contain obsolete link-count advice, which is excluded. Locale designs remain editorial choices, not a claim of popularity or external native-speaker certification.

Production CRM, database, Google integrations, Nginx and PM2 are outside this static-site update.
