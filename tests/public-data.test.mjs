import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const raw = readFileSync(new URL("data.json", root), "utf8");
const data = JSON.parse(raw);
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
  assert.equal(data.schemaVersion, 1);
  assert.match(data.snapshotDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(data.items.length > 0);
  assert.doesNotMatch(raw, privateSignals);
  const ids = new Set();
  const urls = new Set();
  const announcements = new Set();
  for (const item of data.items) {
    assert.deepEqual(Object.keys(item).sort(), keys);
    for (const [key, value] of Object.entries(item)) {
      if (key !== "products") assert.equal(typeof value, "string", `${item.id}.${key}`);
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
    assert.equal(item.verifiedOn, data.snapshotDate);
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
  assert.equal(ignite.length, 98);
  assert.equal(ignite.filter((item) => new URL(item.url).hostname === "news.microsoft.com").length, 45);
  assert.equal(ignite.filter((item) => item.title.includes("unlabeled sensitive files")).length, 1);
  assert.ok(ignite.find((item) => item.title.includes("unlabeled sensitive files")).url.includes("/microsoft-security-blog/"));
  const html = readFileSync(new URL("index.html", root), "utf8");
  assert.ok(html.includes('data-type="Ignite"'));
  assert.ok(html.includes('id="ignite-count"'));
});

test("static site contains no credentials, raw exports, trackers or unsafe rendering", () => {
  const files = readdirSync(root).filter((name) => name !== ".git").sort();
  assert.deepEqual(files, [".nojekyll", "DESIGN.md", "PRODUCT.md", "README.md", "app.js", "data.json", "index.html", "styles.css", "tests"]);
  const html = readFileSync(new URL("index.html", root), "utf8");
  const js = readFileSync(new URL("app.js", root), "utf8");
  assert.doesNotMatch(html + js, /innerHTML|outerHTML|document\.write|eval\(|googletagmanager|google-analytics|access_token|client_secret|gh[pousr]_/);
  const inlineScript = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const hash = createHash("sha256").update(inlineScript).digest("base64");
  assert.ok(html.includes(`'sha256-${hash}'`), "CSP hash must authorize exactly the theme bootstrap");
  assert.ok(html.includes("default-src 'self'"));
  assert.ok(js.includes('fetch("data.json"'));
  assert.equal((html.match(/<script/g) || []).length, 2);
  for (const name of ["app.js", "styles.css"]) {
    assert.ok(readFileSync(new URL(name, root), "utf8").length > 0, join(String(root), name));
  }
});
