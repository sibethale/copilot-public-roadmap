# Design

## Visual direction

A compact white-and-blue application shell: persistent left navigation on
desktop, rounded filter controls, a restrained blue information panel, and a
pink Ignite section. This is a replacement of the earlier editorial layout,
not a blend with its warm background or oversized hero.

The approved reference governs geometry and visual language only. Do not copy
its content, internal menus, counts, assets, fonts, or implementation.

## Surface: public updates

**Mode: Operate.** Readers find an update using its source, product, or a search
term, then open a directly cited public source.

- Use a 56px top bar, a 232px desktop sidebar, and 28px content gutters.
- Lead with a 30px heading and a concise description, not a promotional hero.
- Place publication guidance before the filter panel.
- Show product pills above search and sorting on wide screens.
- Give Ignite a distinct pink section and a working source-filter action.
- Render linked update titles in a two-column grid; use three columns only on
  wide displays and one when the available width becomes constrained.
- Keep provenance, public identifiers, product tags, and supported dates visible.
- Session cards show concise summaries and native expandable details with
  takeaways, verified official video links, and clearly labelled source limits.
  Preserve the compact card layout; do not embed videos or open modal readers.

## Tokens and type

`styles.css` owns the `--cp-*` color tokens. Use white surfaces, neutral borders,
dark text, blue selection states, and a muted pink Ignite surface. Dark mode
uses the same structure with contrast-adjusted tokens.

Use the system Segoe UI/Aptos stack; there are no downloaded font files.
Headings use clear weight steps, controls use 13-14px text, and provenance uses
11-12px text. Keep explanatory copy to roughly 70 characters per line.

The reference's lighter blue is intentionally deepened for readable white
selection text. Borders separate records; reserve the soft shadow for the
filter panel rather than decorating every update.

## Components and states

- Source buttons expose the selected source with `aria-pressed`.
- Product pills and the product selector are two views of the same filter.
- Counts describe the complete public snapshot, not filtered or private data.
- The result count announces changes; the result heading names the source.
- Retain loading, explicit error, no-results, reset, and no-JavaScript states.
- Keep a visible keyboard focus ring and a skip-to-updates link.
- Honor reduced motion; only the filter panel has a brief settling animation.
- Native session disclosures work with keyboard and touch. Expanded copy wraps,
  and summary/takeaway content participates in the existing search.

## Responsive behavior

At 1050px and below, replace product pills with the labelled selector. At
700px and below, put source navigation above the content, wrap its buttons,
remove fixed positioning, and stack the Ignite action.

Do not introduce a menu that requires another interaction just to find source
filters. Long update titles wrap rather than being clipped.

## Boundaries

Keep the independent-publication disclaimer, the reviewed snapshot date,
direct source URLs, and the independent Message Center mirror label.
Design changes must not rewrite the public dataset or add external requests,
analytics, credentials, private links, or assets.
