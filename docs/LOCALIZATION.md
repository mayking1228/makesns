# MakeSNS languages

Supported routes: `en`, `ko`, `ja`, `es` (Spanish), `ms` (Bahasa Melayu, Malaysia). Indonesian `id` is not enabled.

The existing EN/KO/JA message tables are retained. `locale-data.ts` extends built-in English message values with reviewed Spanish/Malay catalogs in `src/lib/locales/{es,ms}.json`. New user-visible copy must have entries in both catalogs. The helper is local and deterministic: it makes no translation API calls and is never applied to user input. Technical IDs, URLs, formats and enum values must not be translated.

`src/lib/locales/profiles.json` contains independently authored 13-theme Spanish and Malay examples, with local names, locations and information. Stable theme IDs and sample handles preserve existing links and saved-choice IDs. `localizeSampleDraft` recognizes untouched built-in samples, preserves custom names and never replaces an edited bio. Favorites and browser consent keep their existing storage keys.

`seo.ts` declares 5 reciprocal hreflang targets and x-default, per-language canonical, locale and social images. Root remains a neutral chooser. The 71 sitemap pages have no forced language redirect. `scripts/social-images.py` rasterizes 6 public 1200×630 PNGs; it needs Pillow and the installed Noto CJK font collection only when regenerating assets. The PNGs are committed with source; site deployment does not need Python image libraries or font installation.

A keyboard-accessible native details menu exposes all five languages without widening mobile pages. Analytics keeps existing tool IDs and consent behavior; `ui_language` adds es/ms. Native symbol search aliases cover Spanish and Malay terms. Accented letters not represented in decorative Unicode stay unchanged.

The optional standalone link service has matching destination/report messages and accepts a validated `lang` query parameter. Redirects remain immediate302, and no destination URL or management key enters analytics.

## Brazilian Portuguese

Published `pt-BR` uses `/pt-BR/` routes and `pt_BR` Open Graph locale. The 519-entry dictionary and thirteen independent profile templates are Brazilian Portuguese, not a generic promise of regional Portuguese coverage. Portuguese browser-language preferences suggest this locale without redirecting. See `SEO-PT-BR-2026-11-01.md` for rollout and measurement.

## Indonesian

Published `id` uses `/id/`, native name Bahasa Indonesia, Open Graph `id_ID`. This is independent of Malay `ms`. The 519-entry Indonesian dictionary, thirteen profile templates and the social card are separately authored. See `INDONESIAN-ROLLOUT.md`.

## Turkish and language flags

Published `tr` uses `/tr/`, native name Türkçe, Open Graph `tr_TR`. Turkish special letters are preserved in content and decorative text; diacritic/dotless-i folding applies only to search. Native profile examples are separately authored. Language selectors show a local SVG flag plus the native name; the neutral language-entry header keeps its globe. English uses US and Brazilian Portuguese uses Brazil. Flag artwork is from flag-icons v7.5.0 (MIT); the original license is bundled at public/flags/LICENSE.txt. No flag request goes to a third-party CDN.
