"use strict";

const allowedHosts = new Set([
  "www.microsoft.com", "techcommunity.microsoft.com", "blogs.microsoft.com",
  "devblogs.microsoft.com", "msmessagecenter.com", "news.microsoft.com",
  "cdn-dynmedia-1.microsoft.com", "ignite.microsoft.com",
]);
const publicDocumentUrl = "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/bade/documents/products-and-services/en-us/ai/CopilotCreditsGuide.pdf";
const publicSessionUrl = "https://ignite.microsoft.com/en-US/sessions/1787856604402001Ec2D-1791588173232001Cx8h";
const types = new Set(["Roadmap", "Blog", "Message Center", "Ignite"]);
const requestedType = new URLSearchParams(location.search).get("source");
const state = { items: [], type: types.has(requestedType) ? requestedType : "" };
const byId = (id) => document.getElementById(id);

function publicUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || !allowedHosts.has(url.hostname) ||
      url.username || url.password || url.port ||
      (url.hostname === "news.microsoft.com" && url.pathname !== "/events/ignite/2026/book-of-news/") ||
      (url.hostname === "cdn-dynmedia-1.microsoft.com" && url.href !== publicDocumentUrl) ||
      (url.hostname === "ignite.microsoft.com" && url.href !== publicSessionUrl)) {
    throw new Error("The snapshot contains an unapproved source URL.");
  }
  return url.href;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function dateLabel(value) {
  if (!value) return "";
  const date = new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf())) throw new Error("The snapshot contains an invalid date.");
  return new Intl.DateTimeFormat("en", {
    month: "short", ...(value.length === 10 ? { day: "numeric" } : {}),
    year: "numeric", timeZone: "UTC",
  }).format(date);
}

function card(item) {
  const article = element("article", item.type === "Ignite" ? "card card-ignite" : "card");
  const top = element("div", "card-top");
  top.append(element("span", "kind", item.type === "Ignite" ? "Ignite 2026" : item.type),
    element("span", "reference", item.reference));
  const title = element("h3");
  const titleLink = element("a", "title-link", item.title);
  titleLink.href = publicUrl(item.url);
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";
  title.append(titleLink);
  article.append(top, title);
  const tags = element("div", "tags");
  item.products.forEach((product) => tags.append(element("span", "tag", product)));
  if (item.status) tags.append(element("span", "tag", item.status));
  article.append(tags);
  const timing = [];
  if (item.published) timing.push(`Published ${dateLabel(item.published)}`);
  if (item.release) timing.push(`Estimated GA ${dateLabel(item.release)}`);
  if (timing.length) article.append(element("p", "timing", timing.join(" | ")));
  const source = element("div", "source-line");
  const link = element("a");
  link.href = publicUrl(item.url);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.append(element("span", "", "Read the source"), element("span", "", "\u2197"));
  link.setAttribute("aria-label", `Read source: ${item.title}`);
  source.append(link, element("small", "", item.publisher));
  article.append(source);
  return article;
}

function render() {
  const search = byId("search").value.trim().toLocaleLowerCase();
  const product = byId("product").value;
  const items = state.items.filter((item) =>
    (!state.type || item.type === state.type) &&
    (!product || item.products.includes(product)) &&
    `${item.title} ${item.reference} ${item.products.join(" ")} ${item.status} ${item.publisher} ${item.type === "Ignite" ? "Ignite 2026" : item.type}`
      .toLocaleLowerCase().includes(search));
  const sort = byId("sort").value;
  items.sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "source") return a.type.localeCompare(b.type) || a.title.localeCompare(b.title);
    return (b.published || "").localeCompare(a.published || "") || a.title.localeCompare(b.title);
  });
  byId("results").replaceChildren(...items.map(card));
  byId("empty").hidden = items.length > 0;
  byId("result-count").textContent = `${items.length} of ${state.items.length} updates`;
  byId("results-heading").textContent = {
    "": "All updates", Roadmap: "Roadmap features", Blog: "Public blogs",
    "Message Center": "Message Center updates", Ignite: "Ignite 2026 updates",
  }[state.type];
  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.type === state.type;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".product-chip").forEach((chip) => {
    const active = chip.dataset.product === product;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
}

function selectSource(type) {
  state.type = type;
  const url = new URL(location.href);
  if (state.type) url.searchParams.set("source", state.type);
  else url.searchParams.delete("source");
  history.replaceState(null, "", url);
  render();
}

function productChip(product, count) {
  const chip = element("button", "product-chip", product || "All products");
  chip.type = "button";
  chip.dataset.product = product;
  chip.setAttribute("aria-pressed", "false");
  chip.append(element("span", "", String(count)));
  chip.addEventListener("click", () => {
    byId("product").value = product;
    render();
  });
  return chip;
}

async function load() {
  try {
    const response = await fetch("data.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Could not load the public snapshot (HTTP ${response.status}).`);
    const data = await response.json();
    if (data.schemaVersion !== 1 || !Array.isArray(data.items) || !data.items.length ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.snapshotDate)) {
      throw new Error("The public snapshot is missing or has an unsupported format.");
    }
    data.items.forEach((item) => {
      if (!types.has(item.type) || typeof item.title !== "string" || !item.title ||
          !Array.isArray(item.products) || !item.products.every((x) => typeof x === "string")) {
        throw new Error("The public snapshot contains an invalid update.");
      }
      publicUrl(item.url);
    });
    state.items = data.items;
    byId("snapshot-date").textContent = dateLabel(data.snapshotDate);
    document.querySelectorAll("[data-count]").forEach((node) => {
      node.textContent = String(state.items.filter((item) =>
        !node.dataset.count || item.type === node.dataset.count).length);
    });
    byId("product-chips").append(productChip("", state.items.length));
    [...new Set(state.items.flatMap((item) => item.products))].sort().forEach((product) => {
      const option = element("option", "", product);
      option.value = product;
      byId("product").append(option);
      byId("product-chips").append(productChip(product,
        state.items.filter((item) => item.products.includes(product)).length));
    });
    document.querySelectorAll("input, select, .tab, .ignite-action").forEach((control) => { control.disabled = false; });
    render();
  } catch (error) {
    console.error("Public roadmap could not be displayed:", error);
    byId("results").replaceChildren();
    byId("empty").hidden = true;
    byId("error").hidden = false;
    byId("error").textContent = `${error instanceof Error ? error.message : "The snapshot could not be displayed."} Reload the page or open the public data link below.`;
    byId("result-count").textContent = "Snapshot unavailable";
  }
}

byId("search").addEventListener("input", render);
["product", "sort"].forEach((id) => byId(id).addEventListener("change", render));
document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
  selectSource(tab.dataset.type);
}));
byId("explore-ignite").addEventListener("click", () => selectSource("Ignite"));
byId("reset").addEventListener("click", () => {
  state.type = "";
  byId("search").value = "";
  byId("product").value = "";
  byId("sort").value = "recent";
  const url = new URL(location.href);
  url.searchParams.delete("source");
  history.replaceState(null, "", url);
  render();
  byId("search").focus();
});
load();
