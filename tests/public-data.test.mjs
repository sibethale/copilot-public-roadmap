import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

const root = new URL("../", import.meta.url);
const raw = readFileSync(new URL("data.json", root), "utf8");
const data = JSON.parse(raw);
const js = readFileSync(new URL("app.js", root), "utf8");
const sourcePolicy = runInNewContext(`${js.split("\nfunction element(")[0]}
  ({ publicUrl, publicSessionUrls, publicVideoUrls });`, {
  URL, URLSearchParams, location: { search: "" },
});
const creditsGuideUrl = "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/bade/documents/products-and-services/en-us/ai/CopilotCreditsGuide.pdf";
const oneNoteSessionUrl = "https://ignite.microsoft.com/en-US/sessions/1787856604402001Ec2D-1791588173232001Cx8h";
const keys = [
  "id", "title", "type", "url", "publisher", "reference", "products", "status",
  "release", "published", "verifiedOn",
].sort();
const blogs = new Set([
  "www.microsoft.com", "techcommunity.microsoft.com", "blogs.microsoft.com",
  "devblogs.microsoft.com",
]);
const privateSignals = /sharepoint\.com|admin\.microsoft\.com|microsoftonline\.com|aka\.ms|localhost|[A-Z]:\\|@[a-z\d.-]+\.[a-z]{2,}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|\b(?:NDA|confidential)\b|AbsAssignee|VbdNotes|AbsMessage|IncludedInVbds|access_token|client_secret|gh[pousr]_/i;

test("the public snapshot has a strict allowlisted schema and no private fields", () => {
  assert.deepEqual(Object.keys(data).sort(), ["items", "schemaVersion", "snapshotDate"]);
  assert.equal(data.schemaVersion, 2);
  assert.match(data.snapshotDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(data.items.length > 0);
  assert.doesNotMatch(raw, privateSignals);
  const ids = new Set();
  const urls = new Set();
  const announcements = new Set();
  for (const item of data.items) {
    assert.deepEqual(Object.keys(item).sort(), item.session ? [...keys, "session"].sort() : keys);
    for (const [key, value] of Object.entries(item)) {
      if (key !== "products" && key !== "session") assert.equal(typeof value, "string", `${item.id}.${key}`);
    }
    assert.ok(item.title.trim().length > 5);
    assert.ok(!ids.has(item.id), `Duplicate id ${item.id}`);
    ids.add(item.id);
    if (item.type === "Ignite") {
      const key = `${item.title}\n${item.url}`;
      assert.ok(!announcements.has(key), `Duplicate Ignite announcement ${item.title}`);
      announcements.add(key);
      assert.equal(item.id, `ignite-${createHash("sha256").update(`${item.url}\n${item.title}`).digest("hex").slice(0, 16)}`);
    } else {
      assert.ok(!urls.has(item.url), `Duplicate source ${item.url}`);
      urls.add(item.url);
    }
    assert.ok(Array.isArray(item.products) && item.products.length > 0);
    assert.ok(item.products.every((product) => typeof product === "string" && product.trim()));
    assert.match(item.verifiedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.verifiedOn <= data.snapshotDate);
    for (const date of [item.published, item.release].filter(Boolean)) {
      assert.match(date, /^\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/);
      assert.ok(!Number.isNaN(Date.parse(date)));
    }
    if (item.published) assert.ok(item.published <= data.snapshotDate);
  }
});

test("source types must match exact public hosts, paths and identifiers", () => {
  for (const item of data.items) {
    const url = new URL(item.url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.username + url.password + url.port + url.hash, "");
    if (item.type === "Ignite") {
      assert.equal(item.release + item.status, "");
      if (url.hostname === "news.microsoft.com") {
        assert.equal(url.pathname, "/events/ignite/2026/book-of-news/");
        assert.equal(item.publisher, "Microsoft Ignite 2026 Book of News");
        assert.equal(item.reference + url.search, "");
      } else if (url.hostname === "cdn-dynmedia-1.microsoft.com") {
        assert.equal(url.href, creditsGuideUrl);
        assert.equal(item.publisher, "Microsoft Copilot Credits Guide (PDF)");
        assert.equal(item.reference, "");
      } else if (url.hostname === "ignite.microsoft.com") {
        assert.ok(sourcePolicy.publicSessionUrls.has(url.href));
        assert.equal(item.publisher, "Microsoft Ignite 2026 session");
        assert.match(item.reference, /^(?:BRK(?:SP)?|THR(?:SP)?|KEY|INV)\d+$/);
        assert.equal(item.published, "");
        assert.ok(item.session);
      } else if (url.hostname === "msmessagecenter.com") {
        assert.match(item.reference, /^MC\d+$/);
        assert.equal(url.pathname, `/${item.reference}/`);
        assert.match(item.publisher, /independent mirror/);
        assert.equal(url.search, "");
      } else if (url.pathname === "/en-us/microsoft-365/roadmap") {
        assert.equal(url.hostname, "www.microsoft.com");
        assert.match(item.reference, /^\d+$/);
        assert.deepEqual([...url.searchParams.keys()], ["id"]);
        assert.equal(url.searchParams.get("id"), item.reference);
        assert.equal(item.publisher, "Microsoft Copilot Roadmap");
      } else {
        assert.ok(blogs.has(url.hostname));
        assert.ok(url.pathname.includes("/blog/") && !url.pathname.includes("/category/"));
        assert.equal(item.reference + url.search, "");
      }
    } else if (item.type === "Roadmap") {
      assert.equal(url.hostname, "www.microsoft.com");
      assert.equal(url.pathname, "/en-us/microsoft-365/roadmap");
      assert.deepEqual([...url.searchParams.keys()], ["id"]);
      assert.match(item.reference, /^\d+$/);
      assert.equal(url.searchParams.get("id"), item.reference);
      assert.equal(item.id, `roadmap-${item.reference}`);
      assert.equal(item.publisher, "Microsoft Copilot Roadmap");
      assert.ok(item.status);
    } else if (item.type === "Message Center") {
      assert.equal(url.hostname, "msmessagecenter.com");
      assert.match(item.reference, /^MC\d+$/);
      assert.equal(url.pathname, `/${item.reference}/`);
      assert.ok(item.title.startsWith(`${item.reference}:`));
      assert.match(item.publisher, /independent mirror/);
      assert.equal(item.release + item.status + url.search, "");
    } else {
      assert.equal(item.type, "Blog");
      assert.ok(blogs.has(url.hostname));
      assert.ok(url.pathname.includes("/blog/"));
      assert.ok(!url.pathname.includes("/category/"));
      assert.equal(item.reference + item.release + item.status + url.search, "");
    }
  }
});

test("the complete reviewed Ignite set includes individual Book of News announcements", () => {
  const ignite = data.items.filter((item) => item.type === "Ignite");
  assert.equal(ignite.length, 341);
  assert.equal(ignite.filter((item) => new URL(item.url).hostname === "news.microsoft.com").length, 45);
  assert.equal(ignite.filter((item) => item.title.includes("unlabeled sensitive files")).length, 1);
  assert.ok(ignite.find((item) => item.title.includes("unlabeled sensitive files")).url.includes("/microsoft-security-blog/"));
  const guides = ignite.filter((item) => item.url === creditsGuideUrl);
  assert.equal(guides.length, 1);
  assert.equal(guides[0].title, "AI Flex Plan: one monetary commitment for Copilot Credits and eligible Microsoft AI consumption");
  assert.equal(guides[0].published, "2026-11");
  const html = readFileSync(new URL("index.html", root), "utf8");
  assert.ok(html.includes('data-type="Ignite"'));
  assert.ok(html.includes('id="ignite-count"'));
});

test("the public OneNote session and existing OneNote updates are discoverable by product", () => {
  const sessions = data.items.filter((item) => item.url === oneNoteSessionUrl);
  assert.equal(sessions.length, 1);
  assert.equal(sessions[0].title, "Agentic productivity with new Copilot capabilities in OneNote");
  assert.equal(sessions[0].type, "Ignite");
  assert.equal(sessions[0].published + sessions[0].release + sessions[0].status, "");
  const oneNoteItems = data.items.filter((item) => item.title.includes("OneNote"));
  assert.ok(oneNoteItems.length >= 4);
  assert.ok(oneNoteItems.every((item) => item.products.includes("OneNote")));
});

test("the browser permits only the reviewed public PDF, not arbitrary CDN documents", () => {
  const js = readFileSync(new URL("app.js", root), "utf8");
  const publicUrl = runInNewContext(`${js.split("\nfunction element(")[0]}\npublicUrl;`, {
    URL, URLSearchParams, location: { search: "" },
  });
  assert.equal(publicUrl(creditsGuideUrl), creditsGuideUrl);
  for (const value of [
    creditsGuideUrl.replace("CopilotCreditsGuide.pdf", "OtherGuide.pdf"),
    `${creditsGuideUrl}?download=1`,
    `${creditsGuideUrl}#page=4`,
    creditsGuideUrl.replace("https:", "http:"),
    creditsGuideUrl.replace("https://", "https://user:password@"),
    creditsGuideUrl.replace(".com/", ".com:8443/"),
    creditsGuideUrl.replace(".com/", ".com.example.org/"),
  ]) {
    assert.throws(() => publicUrl(value), /unapproved source URL/);
  }
});

test("the browser permits only explicitly reviewed public sessions and official videos", () => {
  const js = readFileSync(new URL("app.js", root), "utf8");
  const publicUrl = runInNewContext(`${js.split("\nfunction element(")[0]}\npublicUrl;`, {
    URL, URLSearchParams, location: { search: "" },
  });
  assert.equal(sourcePolicy.publicSessionUrls.size, 242);
  assert.equal(sourcePolicy.publicVideoUrls.size, 230);
  for (const value of [...sourcePolicy.publicSessionUrls, ...sourcePolicy.publicVideoUrls]) {
    assert.equal(publicUrl(value), value);
    for (const altered of [
      `${value}&tracking=1`, `${value}#recording`,
      value.replace("https:", "http:"),
      value.replace("https://", "https://user:password@"),
      value.replace(".com/", ".com:8443/"),
      value.replace(".com/", ".com.example.org/"),
    ]) assert.throws(() => publicUrl(altered), /unapproved source URL/);
  }
  for (const value of [
    oneNoteSessionUrl.replace("Cx8h", "Other"),
    "https://ignite.microsoft.com/en-US/sessions",
    `${oneNoteSessionUrl}?source=sessions`,
    `${oneNoteSessionUrl}#recording`,
    oneNoteSessionUrl.replace("https:", "http:"),
    oneNoteSessionUrl.replace("https://", "https://user:password@"),
    oneNoteSessionUrl.replace(".com/", ".com:8443/"),
    oneNoteSessionUrl.replace(".com/", ".com.example.org/"),
    "https://ignite.microsoft.com/en-US/sessions/BRK99999",
    "https://www.youtube.com/watch?v=kkY4LWr3_48",
    "https://www.youtube.com/watch?v=Ksybv8qU-KA",
    "https://www.youtube.com/watch?v=arbitrary",
    "https://www.youtube.com/@events_msft",
  ]) {
    assert.throws(() => publicUrl(value), /unapproved source URL/);
  }
});

test("all 257 original records are preserved without pretending they were reverified", () => {
  const originals = data.items
    .filter((item) => !item.session || item.reference === "BRK207")
    .map(({ session, ...item }) => item.reference === "BRK207" ? { ...item, verifiedOn: "2026-11-20" } : item);
  assert.equal(originals.length, 257);
  assert.equal(createHash("sha256").update(JSON.stringify(originals)).digest("hex"),
    "33c2db4561d340533e7b92d65138a00c5ba94d924e0448e4b2ef8e04b71fe96e");
});

test("242 unique session briefs contain bounded details and matching reviewed links", () => {
  const sessions = data.items.filter((item) => item.session);
  assert.equal(data.items.length, 498);
  assert.equal(sessions.length, 242);
  assert.equal(new Set(sessions.map((item) => item.reference)).size, 242);
  assert.deepEqual(new Set(sessions.map((item) => item.url)), new Set(sourcePolicy.publicSessionUrls));
  assert.deepEqual(new Set(sessions.map((item) => item.session.videoUrl).filter(Boolean)),
    new Set(sourcePolicy.publicVideoUrls));
  assert.equal(sessions.filter((item) => !item.session.videoUrl).length, 12);
  for (const item of sessions) {
    assert.equal(item.type, "Ignite");
    assert.equal(item.verifiedOn, "2026-11-24");
    assert.deepEqual(Object.keys(item.session).sort(), ["evidence", "summary", "takeaways", "videoUrl"]);
    assert.equal(typeof item.session.summary, "string");
    assert.ok(item.session.summary.length > 10 && item.session.summary.length <= 700);
    assert.ok(item.session.takeaways.length >= 2 && item.session.takeaways.length <= 3);
    assert.ok(item.session.takeaways.every((text) => typeof text === "string" && text.length > 10 && text.length <= 500));
    assert.equal(new Set(item.session.takeaways).size, item.session.takeaways.length);
    assert.ok(`${item.session.summary} ${item.session.takeaways.join(" ")}`.split(/\s+/).length <= 87);
    assert.match(item.session.evidence, /Public session description/);
    assert.match(item.session.evidence, /not a transcript-complete review/);
    assert.match(item.session.evidence, /not a release commitment/);
    if (!item.session.videoUrl) assert.match(item.session.evidence, /could not be verified/);
    else {
      const video = new URL(item.session.videoUrl);
      assert.equal(video.origin + video.pathname, "https://www.youtube.com/watch");
      assert.deepEqual([...video.searchParams.keys()], ["v"]);
      assert.match(video.searchParams.get("v"), /^[\w-]{11}$/);
    }
  }
});

function browser(document = {}) {
  return runInNewContext(`${js.split('\nbyId("search").addEventListener')[0]}
    ({ validateItem, card, render, state, igniteSourceType, selectSource });`, {
    URL, URLSearchParams, location: { search: "", href: "https://example.org/?source=Ignite" },
    history: { replaceState() {} }, document: { dispatchEvent() {}, ...document }, Event, Intl,
  });
}

test("the browser rejects malformed session payloads and unapproved source/video combinations", () => {
  const { validateItem } = browser();
  for (const item of data.items) validateItem(item);
  const session = data.items.find((item) => item.session);
  const clone = () => structuredClone(session);
  const invalid = [
    { ...session, session: null },
    { ...session, session: undefined },
    { ...session, session: { ...session.session, rawNotes: "not allowed" } },
    { ...session, session: { ...session.session, summary: "" } },
    { ...session, session: { ...session.session, summary: "x".repeat(701) } },
    { ...session, session: { ...session.session, evidence: "" } },
    { ...session, session: { ...session.session, takeaways: ["only one"] } },
    { ...session, session: { ...session.session, takeaways: ["one", 2] } },
    { ...session, session: { ...session.session, videoUrl: "https://www.youtube.com/watch?v=unreviewed" } },
    { ...session, type: "Blog" },
    { ...session, url: creditsGuideUrl },
    { ...session, url: session.session.videoUrl },
  ];
  const missing = clone();
  delete missing.session;
  invalid.push(missing);
  for (const item of invalid) assert.throws(() => validateItem(item));
});

class Node {
  constructor(tag = "div") {
    this.tag = tag;
    this.children = [];
    this.attributes = {};
    this.value = "";
    this.classList = { toggle() {} };
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = value; }
}

function descendants(node) {
  return [node, ...node.children.flatMap(descendants)];
}

test("session cards render safe native details and outbound videos without embeds", () => {
  const { card } = browser({ createElement: (tag) => new Node(tag) });
  const item = structuredClone(data.items.find((record) => record.session?.videoUrl));
  item.session.summary = "<img src=x onerror=alert(1)>";
  item.session.takeaways[0] = "<script>alert(1)</script>";
  const nodes = descendants(card(item));
  assert.equal(nodes.find((node) => node.className === "session-summary").textContent, item.session.summary);
  assert.ok(nodes.some((node) => node.tag === "li" && node.textContent === item.session.takeaways[0]));
  assert.ok(nodes.some((node) => node.tag === "details"));
  const disclosure = nodes.find((node) => node.tag === "summary");
  assert.equal(disclosure.textContent, "Session details");
  assert.ok(disclosure.attributes["aria-label"].includes(item.title));
  const video = nodes.find((node) => node.className === "session-video");
  assert.equal(video.href, item.session.videoUrl);
  assert.equal(video.target, "_blank");
  assert.equal(video.rel, "noopener noreferrer");
  assert.ok(!nodes.some((node) => ["iframe", "video", "script", "img"].includes(node.tag)));
  item.session.videoUrl = "";
  assert.ok(!descendants(card(item)).some((node) => node.className === "session-video"));
  assert.ok(!descendants(card(data.items.find((record) => !record.session))).some((node) => node.tag === "details"));
});

test("search includes session summaries and takeaways while preserving source and product filters", () => {
  const nodes = new Map(["search", "product", "sort", "results", "empty", "result-count", "results-heading", "ignite-source-filter"]
    .map((id) => [id, new Node()]));
  const { render, state } = browser({
    createElement: (tag) => new Node(tag),
    getElementById: (id) => nodes.get(id),
    querySelectorAll: () => [],
  });
  const item = structuredClone(data.items.find((record) => record.reference === "BRK207"));
  item.session.summary = "uniquesummaryterm";
  item.session.takeaways = ["uniquetakeawayterm", "Another supported takeaway"];
  state.items = [item, data.items.find((record) => record.type === "Blog")];
  state.type = "Ignite";
  nodes.get("search").value = "uniquesummaryterm";
  render();
  assert.equal(nodes.get("results").children.length, 1);
  nodes.get("search").value = "uniquetakeawayterm";
  nodes.get("product").value = "OneNote";
  render();
  assert.equal(nodes.get("results").children.length, 1);
  state.type = "Roadmap";
  render();
  assert.equal(nodes.get("results").children.length, 0);
  state.type = "Ignite";
  nodes.get("product").value = "unmatched product";
  render();
  assert.equal(nodes.get("results").children.length, 0);
});

test("Ignite source categories partition the public event set without changing data", () => {
  const { igniteSourceType } = browser();
  const counts = {};
  for (const item of data.items.filter((record) => record.type === "Ignite")) {
    const source = igniteSourceType(item);
    counts[source] = (counts[source] || 0) + 1;
    if (item.session) assert.equal(source, "session");
    if (source === "roadmap") assert.match(item.url, /\/roadmap\?id=/);
    if (source === "blog") assert.ok(new URL(item.url).pathname.includes("/blog/"));
  }
  assert.deepEqual(counts, { pdf: 1, session: 242, blog: 39, roadmap: 1, message: 13, news: 45 });
  assert.throws(() => igniteSourceType({ url: "https://example.org/unreviewed" }), /unsupported Ignite source type/);
});

test("Ignite source filters combine with search and products and reset when leaving Ignite", () => {
  const nodes = new Map(["search", "product", "sort", "results", "empty", "result-count", "results-heading", "ignite-source-filter"]
    .map((id) => [id, new Node()]));
  const chips = ["", "session", "news", "blog", "roadmap", "message", "pdf"].map((source) => {
    const node = new Node("button");
    node.dataset = { igniteSource: source };
    return node;
  });
  const { render, state, selectSource, igniteSourceType } = browser({
    createElement: (tag) => new Node(tag),
    getElementById: (id) => nodes.get(id),
    querySelectorAll: (selector) => selector === ".source-chip" ? chips : [],
  });
  state.items = data.items;
  state.type = "Ignite";
  for (const chip of chips) {
    state.igniteSource = chip.dataset.igniteSource;
    render();
    const expected = data.items.filter((item) => item.type === "Ignite" &&
      (!state.igniteSource || igniteSourceType(item) === state.igniteSource)).length;
    assert.equal(nodes.get("results").children.length, expected);
    assert.equal(nodes.get("ignite-source-filter").hidden, false);
    assert.equal(chip.attributes["aria-pressed"], "true");
    assert.equal(chips.filter((node) => node.attributes["aria-pressed"] === "true").length, 1);
  }
  state.igniteSource = "session";
  nodes.get("search").value = "BRK207";
  nodes.get("product").value = "OneNote";
  render();
  assert.equal(nodes.get("results").children.length, 1);
  state.igniteSource = "blog";
  render();
  assert.equal(nodes.get("results").children.length, 0);
  assert.equal(nodes.get("empty").hidden, false);
  selectSource("Blog");
  assert.equal(state.igniteSource, "");
  assert.equal(nodes.get("ignite-source-filter").hidden, true);
  nodes.get("search").value = "";
  nodes.get("product").value = "";
  selectSource("Ignite");
  assert.equal(nodes.get("results").children.length, 341);
  assert.equal(nodes.get("ignite-source-filter").hidden, false);
});

test("static site contains no credentials, raw exports, trackers or unsafe rendering", () => {
  const files = readdirSync(root).filter((name) => name !== ".git").sort();
  assert.deepEqual(files, [".nojekyll", "DESIGN.md", "PRODUCT.md", "README.md", "app.js", "appearance.js", "data.json", "index.html", "styles.css", "tests"]);
  const html = readFileSync(new URL("index.html", root), "utf8");
  const js = readFileSync(new URL("app.js", root), "utf8");
  const appearance = readFileSync(new URL("appearance.js", root), "utf8");
  assert.doesNotMatch(html + js + appearance, /innerHTML|outerHTML|document\.write|eval\(|googletagmanager|google-analytics|access_token|client_secret|gh[pousr]_/);
  assert.doesNotMatch(appearance, /fetch\(|XMLHttpRequest|sendBeacon|https?:\/\//);
  const inlineScript = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const hash = createHash("sha256").update(inlineScript).digest("base64");
  assert.ok(html.includes(`'sha256-${hash}'`), "CSP hash must authorize exactly the theme bootstrap");
  assert.ok(html.includes("default-src 'self'"));
  assert.ok(js.includes('fetch("data.json"'));
  assert.equal((html.match(/<script/g) || []).length, 3);
  for (const name of ["app.js", "appearance.js", "styles.css"]) {
    assert.ok(readFileSync(new URL(name, root), "utf8").length > 0, join(String(root), name));
  }
});

function appearanceFunctions() {
  const appearance = readFileSync(new URL("appearance.js", root), "utf8");
  return runInNewContext(`${appearance.split("\nstartAppearance();")[0]}
    ({ appearancePreferences, resolvedTheme, themeChoices, darkThemes, motionChoices });`);
}

function bootstrap({ stored = null, query = "", prefersDark = false, reduced = false, blocked = false } = {}) {
  const html = readFileSync(new URL("index.html", root), "utf8");
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const dataset = {};
  const warnings = [];
  runInNewContext(script, {
    localStorage: { getItem() { if (blocked) throw new Error("Storage blocked"); return stored; } },
    document: { documentElement: { dataset } },
    window: {
      location: { search: query },
      matchMedia: (value) => ({ matches: value.includes("reduced-motion") ? reduced : prefersDark }),
    },
    console: { warn: (...args) => warnings.push(args) },
    URLSearchParams,
  });
  return { dataset, warnings };
}

test("theme bootstrap honors saved choices, URL overrides, System and safe fallbacks before rendering", () => {
  const { themeChoices, darkThemes } = appearanceFunctions();
  for (const [theme] of themeChoices) {
    for (const prefersDark of [false, true]) {
      const { dataset } = bootstrap({ stored: JSON.stringify({ theme }), prefersDark });
      assert.equal(dataset.themeChoice, theme);
      assert.equal(dataset.theme, theme === "system" ? (prefersDark ? "dark" : "light") : theme);
      assert.equal(dataset.colorScheme, darkThemes.has(dataset.theme) ? "dark" : "light");
    }
  }
  assert.equal(bootstrap({ stored: '{"theme":"sakura"}', query: "?source=Ignite&clawpilotTheme=abyss" }).dataset.theme, "abyss");
  assert.equal(bootstrap({ stored: '{"theme":"sakura"}', query: "?clawpilotTheme=unreviewed" }).dataset.theme, "sakura");
  assert.equal(bootstrap({ stored: '{"theme":"unreviewed"}', prefersDark: true }).dataset.theme, "dark");
  const blocked = bootstrap({ blocked: true });
  assert.equal(blocked.dataset.theme, "light");
  assert.equal(blocked.warnings.length, 1);
  const malformed = bootstrap({ stored: "not json", prefersDark: true });
  assert.equal(malformed.dataset.theme, "dark");
  assert.equal(malformed.warnings.length, 1);
  assert.equal(bootstrap({ reduced: true }).dataset.motionBusy, undefined);
  assert.equal(bootstrap({ stored: '{"motion":{"busy":false}}' }).dataset.motionBusy, undefined);
});

test("appearance preferences retain individual off switches and reject malformed stored data", () => {
  const { appearancePreferences, resolvedTheme } = appearanceFunctions();
  const prefs = appearancePreferences('{"theme":"terminal","motion":{"intro":false,"count":false,"background":false,"panel":true,"busy":"false"}}');
  assert.equal(prefs.theme, "terminal");
  assert.equal(prefs.motion.intro, false);
  assert.equal(prefs.motion.count, false);
  assert.equal(prefs.motion.background, false);
  assert.equal(prefs.motion.panel, true);
  assert.equal(prefs.motion.busy, true);
  assert.equal(appearancePreferences('{"theme":"unknown","motion":null}').theme, "system");
  for (const value of ["not json", "null", "[]", "false"]) {
    assert.throws(() => appearancePreferences(value));
  }
  assert.equal(resolvedTheme("system", true), "dark");
  assert.equal(resolvedTheme("system", false), "light");
  assert.equal(resolvedTheme("sakura", true), "sakura");
});

test("generated animation controls cannot collide with static page IDs", () => {
  const { motionChoices } = appearanceFunctions();
  const html = readFileSync(new URL("index.html", root), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  ids.push(...motionChoices.map(([key]) => `motion-${key}`));
  assert.equal(new Set(ids).size, ids.length, "Every control and label must have a unique ID");
});

test("counting uses frame timestamps without negative totals and finishes at the exact count", () => {
  const appearance = readFileSync(new URL("appearance.js", root), "utf8");
  const countTotals = appearance.match(/  function countTotals\(\) \{[\s\S]*?\n  \}/)[0];
  const node = { textContent: "498" };
  const frames = [];
  const counters = new Map();
  runInNewContext(`${countTotals}\ncountTotals();`, {
    enabled: () => true,
    document: { querySelectorAll: () => [node] },
    performance: { now: () => 1000 },
    requestAnimationFrame: (frame) => frames.push(frame),
    counters,
  });
  frames.shift()(850);
  assert.equal(node.textContent, "0");
  frames.shift()(1060);
  assert.ok(Number(node.textContent) > 0 && Number(node.textContent) < 498);
  frames.shift()(1270);
  assert.equal(node.textContent, "498");
  assert.equal(counters.size, 0);
  assert.equal(frames.length, 0);
});
