# Copilot public roadmap

A searchable, independently curated snapshot of public Microsoft Copilot and
agent updates. This is not an official Microsoft publication or a live feed.

## Publication boundary

The site publishes public-source records, not an export of an internal list:

- Roadmap features are selected by public feature ID and populated exclusively
  from Microsoft's anonymous public roadmap API.
- Blog links are deduplicated by article. Titles come from the public article,
  not private notes or edited list titles.
- Message Center entries come only from anonymously accessible pages on
  MS Message Center, an independent third-party mirror. The mirror is not the
  Microsoft 365 admin center and is labelled accordingly.
- NDA entries, internal annotations, customer data, people, tenant identifiers,
  private URLs, credentials, unavailable sources, and unverified metadata are
  excluded. No private data is hidden inside client-side files or Git history.

Only public-source titles, public URLs, source labels, public identifiers,
public product tags, and source-supported dates/statuses belong in `data.json`.
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
using GitHub Pages. Display the review date in `snapshotDate`. Roadmap estimates
can change, and an unavailable feature may have been removed from the live API.
This intentionally conservative snapshot is not a claim that every public
announcement has been included.

## Site

Static HTML, CSS, and JavaScript, with no external packages, analytics, remote
fonts, build pipeline, or authentication. Search, product filters, source tabs,
and sorting all run locally in the browser over the reviewed public snapshot.
