# MakeSNS navigation and UX review

This change groups tasks so the global header does not grow with the number of tools. Existing content and the profile before/after gallery remain available. Current published locales remain EN/KO/JA/ES/MS. No placeholder language routes are created.

## Interface delivered

- PC: three labeled disclosure groups (text, images/video, QR/links), pastel line icons, a prominent profile builder, tool search and language selection. The active tool and its category are marked. Menus open by click/keyboard; Escape, outside clicks and leaving header focus dismiss them.
- Mobile/tablet: compact brand, language button and menu button. A native modal dialog exposes all categories with short descriptions and the profile builder first. Native focus trapping, Escape, backdrop close, focus restoration and background scroll locking keep the menu usable.
- All languages, including the neutral root chooser, use the same header and registered destinations. Root does not pretend a language was selected.
- Home: profile-building action, a grouped searchable task directory near the top, preserved before/after gallery, then examples and useful privacy information. Repeated four-tool, reel and link lists are consolidated into one directory. Full profile editing stays on the dedicated page.
- Footer: the same categories and destinations, followed by profile/help/privacy. Brands remain linked without competing with tool tasks.
- Symbols: native category selection with counts, separate search/type filters, favorites/recent, preserved stable symbol IDs and all existing symbols. This scales without a growing wall of category tabs.
- The circular-crop destination opens the round-photo mode directly using /resizer/#round. Switching languages retains this safe fragment, never management-key fragments.
- Search is local only. Tool queries and language queries are not stored or sent to analytics. Every icon is accompanied by a label; country flags are not used to represent languages.

## Registries and extension rules

`src/lib/navigation.ts` defines tool destinations, groups, labels, short descriptions and search aliases. `NavigationHeader`, `ToolDirectory` and `Footer` consume this registry. Add a tool here after its working route, translations and page metadata exist. New items automatically join their group and search. Register the corresponding line icon in `NavigationIcon.tsx`.

`src/lib/language-registry.ts` defines published language codes, names, aliases and Open Graph locales. Routing, language selection, sitemap, schema languages and analytics recognition read the published set. `languageRoadmap` is planning data only and cannot appear in the public picker or hreflang. Activating a locale still requires complete message catalogs and native examples; type/route/SEO tests must pass before publication.

## Proposed expansion order

1. French and German: establish native product vocabulary, profile examples and accent/long-word handling while keeping Latin-script font behavior clear.
2. Vietnamese, Filipino and Turkish: review tone and regional usefulness; test combining accents, case mapping and actual copy results. Confirm Filipino/Tagalog language identifiers with current search-engine guidance before enabling routes.
3. Russian, Thai and Hindi: additional script/font/rendering review. Russian decorative Unicode cannot simply mirror Latin alphabets. Thai needs word-boundary and no-space line-break review. Hindi needs a suitable Devanagari font, shaping and grapheme/copy tests. Self-host any added licensed fonts.

“Indian” is not a single language. Hindi is recorded as a proposal with `needsDecision`; it must be confirmed before translation/publication. Other Indian languages can have independent future entries.

## Publication checklist for every language

- Native review of navigation, tool controls/errors, consent/privacy, guides and all 13 practical profile themes; no borrowed Korean names or untranslated sample paragraphs.
- Character support policy, names/accents, clipboard behavior, input limits and text rendering checked on mobile and PC.
- Dedicated shared PNG, localized title/description, correct html lang/canonical/hreflang/x-default/OG locale/schema/sitemap. No empty language pages or automatic redirects.
- Search aliases, native language name and English lookup name; existing user drafts and favorites preserved.
- Consent and analytics allowlist recognize the locale without recording user text or search queries. Short-link destination/report copy follows the same published languages.

Future priorities after this release: use consented GA4 tool-use/copy/download counts to identify discovery problems; review image and profile workflows with real users; add content categories through data rather than more global menu buttons. No new language is declared live until these checks are complete.

## Menu scroll correction

Explicit menu/tool-directory/footer navigation owns its top reset after the destination URL is committed. Next automatic scroll is disabled for these links. Mode-only hashes (#round/#resize) select a tool rather than a lower-page anchor. Modified/new-tab clicks do not reset the source page. Pending resets cancel on popstate so browser back/forward can restore position. Modal focus restoration uses preventScroll. Intentional editor/template anchors remain workflow navigation.
