# Copilot public roadmap

A searchable, independently curated snapshot of public Microsoft Copilot and
agent updates. This is not an official Microsoft publication or a live feed.

## Publication boundary

The site publishes public-source records, not an export of an internal list:

- Roadmap features are selected by public feature ID and populated exclusively
  from Microsoft's anonymous public roadmap API.
- The existing blog feed is deduplicated by article. Titles come from the public article,
  not private notes or edited list titles.
- The **Ignite 2026** filter includes 341 reviewed announcements and public
  sessions alongside the source-level feed. Concise factual titles are verified
  against the public Book of News, product blogs, public roadmap, Copilot Credits
  Guide (PDF), session catalog, or labelled Message Center mirrors.
  Multiple announcements can share a source; they are not duplicate
  article records. Open `?source=Ignite` to link directly to this view.
- All 242 reviewed session notes are represented by a public session brief.
  BRK207 retains its existing canonical URL and identity; the other 241 sessions
  use individually verified public catalog URLs. The original 257 records remain.
  Each brief includes a concise summary, two or three takeaways, product tags,
  and evidence limitations. Public descriptions and, where explicitly labelled,
  Microsoft's AI-generated session summaries support the briefs. These are not
  transcript-complete reviews, and unsupported local analysis is not copied.
- The browser permits only the explicitly reviewed session URLs and 230 verified
  official YouTube videos, not arbitrary pages or videos on those hosts.
  Unavailable, third-party, and mismatched videos are omitted; affected briefs
  direct readers to their public session page for recordings. Videos are linked,
  never embedded or fetched automatically.
- No transcript, raw local note, attendee data, or private catalog field is
  republished. Session dates are not treated as publication or release dates,
  and a session listing is not a release commitment. Sponsored sessions remain
  identifiable by their BRKSP/THRSP session codes.
- The AI Flex Plan entry is supported by the November 2026 Copilot Credits Guide,
  PDF page 4 (printed page 3). The browser permits only that exact public PDF URL
  on Microsoft's CDN, not arbitrary files on the same host. Its publication date
  uses the guide's stated month; no exact publication day is inferred from file
  metadata. The PDF itself is linked, not republished.
- Message Center entries come only from anonymously accessible pages on
  MS Message Center, an independent third-party mirror. The mirror is not the
  Microsoft 365 admin center and is labelled accordingly.
- NDA entries, internal annotations, private customer data, personal contact details, tenant identifiers,
  private URLs, credentials, unavailable sources, and unverified metadata are
  excluded. No private data is hidden inside client-side files or Git history.

Only public-source titles, public URLs, source labels, public identifiers,
public product tags, source-supported dates/statuses, and reviewed session
briefs belong in `data.json`. `Cross-product` means the public evidence does not
identify a product covered by the site's product taxonomy; it is not an inferred
product association.
No SharePoint connection, app registration, token, or secret is needed to view
or deploy the site.

## Refreshing

This snapshot is refreshed on request after reviewing the public sources.
There is deliberately no scheduled synchronization with an internal system.
Keep raw exports and review evidence **outside this repository**.

For each refresh, exclude restricted entries before any public-source
retrieval. Fetch the remaining public links anonymously. Construct records
from the retrieved public sources only; never merge private row fields into
public records. Exclude failures rather than guessing. Review the final data,
then run:

```text
node --test tests/public-data.test.mjs
```

Commit only the reviewed site files and publish from `main` / repository root
using GitHub Pages. Display the latest refresh date in `snapshotDate`, but retain
each existing record's actual `verifiedOn` date unless its source was rechecked.
Roadmap estimates can change, and an unavailable feature may have been removed from the live API.
This intentionally conservative snapshot is not a claim that every public
announcement has been included.

Ignite announcement records use the `Ignite` type. Their IDs are derived from
the public URL and reviewed title, never private list identifiers. Do not copy
release dates or statuses from private annotations: those fields remain empty
for event details unless separately verified. Preserve the existing source
records when refreshing event details. Review every claim, not just whether
its linked page is accessible; use a more precise public citation where needed.
Schema version 2 adds an optional `session` object containing `summary`,
`takeaways`, `videoUrl`, and `evidence`. It is allowed only on reviewed Ignite
session records. Summaries and takeaways are searchable; evidence limitations
remain visible inside the native expandable details.

## Site

Static HTML, CSS, and JavaScript, with no external packages, analytics, remote
fonts, build pipeline, or authentication. Search, product filters, source
navigation, and sorting all run locally over the reviewed public snapshot.
In the Ignite 2026 tab, a Source type row below the existing filters narrows
results to sessions, Book of News, blogs, roadmap, Message Center, or PDF guides.
Counts describe the full Ignite set; source type combines with search and product
filters and resets to All sources when leaving Ignite or clearing all filters.
The row is hidden in the other tabs.

The compact application layout uses source navigation, product pills, and an
Ignite section. Counts come from the public snapshot, not an internal service.
On smaller screens, source navigation wraps above the page and a product
selector replaces the pills. Light/dark system preferences and the existing
`clawpilotTheme=light` or `clawpilotTheme=dark` override remain supported.
See `PRODUCT.md` for the publication constraints and `DESIGN.md` for the visual
and interaction rules. No reference-app screenshots, fonts, or private assets
are distributed with this site.

When changing CSS or JavaScript, increment the asset version in both resource
URLs in `index.html` so the new layout cannot reuse older cached assets.
