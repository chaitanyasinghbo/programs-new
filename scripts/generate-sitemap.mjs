#!/usr/bin/env node

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const SITE_ORIGIN = "https://www.blueocean.education";
const SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9";
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DIR = path.join(ROOT_DIR, "blog");
const OUTPUT_XML = path.join(ROOT_DIR, "sitemap.xml");
const OUTPUT_GZ = path.join(ROOT_DIR, "sitemap.xml.gz");

const EXCLUDED_DIRS = new Set(["assets", "static"]);

const EXCLUDED_BASENAME_PATTERNS = [
  { label: "blank-*", pattern: /^blank(?:[-.]|$)/i },
  { label: "404*", pattern: /^404(?:[-.]|$)/i },
  { label: "thank-you*", pattern: /^thank-you(?:[-.]|$)/i },
  { label: "template*", pattern: /(?:^|[-.])template(?:[-.]|$)/i },
  { label: "test*", pattern: /(?:^|[-.])test(?:[-.]|$)/i },
  { label: "draft*", pattern: /(?:^|[-.])draft(?:[-.]|$)/i },
];

const EXCLUDED_ROUTE_PATTERNS = [
  { label: "blank-*", pattern: /^\/blank(?:[-/]|$)/i },
  { label: "404*", pattern: /^\/404(?:[-/]|$)/i },
  { label: "thank-you*", pattern: /^\/thank-you(?:[-/]|$)/i },
];

const CANONICAL_TAG_RE = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i;
const ROBOTS_TAG_RE = /<meta\b[^>]*\bname=["']robots["'][^>]*>/i;
const NOINDEX_RE = /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*\bnoindex\b/i;

function listRootHtmlFiles() {
  return readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.html?$/i.test(entry.name))
    .map((entry) => path.join(ROOT_DIR, entry.name))
    .sort();
}

function walkBlogFiles(dirPath) {
  const files = [];

  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".well-known") {
      continue;
    }

    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) {
        continue;
      }

      files.push(...walkBlogFiles(entryPath));
      continue;
    }

    if (entry.isFile() && /\.html?$/i.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function collectPublicHtmlFiles() {
  const files = [...listRootHtmlFiles()];

  if (existsSync(BLOG_DIR)) {
    files.push(...walkBlogFiles(BLOG_DIR));
  }

  return files;
}

function toRoutePath(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath).split(path.sep).join("/");

  if (relativePath === "index.html") {
    return "/";
  }

  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"index.html".length)}`;
  }

  return `/${relativePath}`;
}

function toCanonicalUrl(routePath) {
  return new URL(routePath, `${SITE_ORIGIN}/`).toString();
}

function findPatternMatch(routePath, basename) {
  const basenameMatch = EXCLUDED_BASENAME_PATTERNS.find(({ pattern }) => pattern.test(basename));

  if (basenameMatch) {
    return basenameMatch.label;
  }

  const routeMatch = EXCLUDED_ROUTE_PATTERNS.find(({ pattern }) => pattern.test(routePath));

  return routeMatch ? routeMatch.label : null;
}

function splitLines(html) {
  const eol = html.includes("\r\n") ? "\r\n" : "\n";
  return { eol, lines: html.split(/\r?\n/) };
}

function leadingWhitespace(line) {
  return line.match(/^\s*/)?.[0] ?? "";
}

function findLineIndex(lines, regex) {
  return lines.findIndex((line) => regex.test(line));
}

function preferredIndent(lines, indices) {
  for (const index of indices) {
    if (index >= 0 && index < lines.length) {
      return leadingWhitespace(lines[index]);
    }
  }

  return "";
}

function insertLine(lines, index, line) {
  lines.splice(index, 0, line);
}

function upsertCanonical(lines, canonicalUrl) {
  const canonicalIndex = findLineIndex(lines, CANONICAL_TAG_RE);
  const descriptionIndex = findLineIndex(lines, /<meta\b[^>]*\bname=["']description["']/i);
  const titleIndex = findLineIndex(lines, /<title>/i);
  const headIndex = findLineIndex(lines, /<head>/i);
  const indent = preferredIndent(lines, [canonicalIndex, descriptionIndex, titleIndex]);
  const line = `${indent}<link rel="canonical" href="${canonicalUrl}">`;

  if (canonicalIndex >= 0) {
    lines[canonicalIndex] = line;
    return findLineIndex(lines, CANONICAL_TAG_RE);
  }

  const insertAt = descriptionIndex >= 0
    ? descriptionIndex + 1
    : titleIndex >= 0
      ? titleIndex + 1
      : headIndex >= 0
        ? headIndex + 1
        : 0;

  insertLine(lines, insertAt, line);
  return insertAt;
}

function ensureExcludedRobots(lines, afterIndex) {
  const robotsIndex = findLineIndex(lines, ROBOTS_TAG_RE);
  const indent = preferredIndent(lines, [robotsIndex, afterIndex]);
  const line = `${indent}<meta name="robots" content="noindex,follow">`;

  if (robotsIndex >= 0) {
    lines[robotsIndex] = line;
    return;
  }

  insertLine(lines, afterIndex + 1, line);
}

function synchronizeSeoTags(filePath, routePath, excluded) {
  const originalHtml = readFileSync(filePath, "utf8");
  const { eol, lines } = splitLines(originalHtml);
  const canonicalIndex = upsertCanonical(lines, toCanonicalUrl(routePath));

  if (excluded) {
    ensureExcludedRobots(lines, canonicalIndex);
  }

  const updatedHtml = lines.join(eol);

  if (updatedHtml !== originalHtml) {
    writeFileSync(filePath, updatedHtml, "utf8");
  }
}

function gitStatusForFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const result = spawnSync("git", ["status", "--porcelain", "--", relativePath], {
    cwd: ROOT_DIR,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return "";
  }

  return result.stdout.trim();
}

function getLastModifiedDate(filePath) {
  if (gitStatusForFile(filePath)) {
    return statSync(filePath).mtime.toISOString().slice(0, 10);
  }

  const relativePath = path.relative(ROOT_DIR, filePath);
  const gitResult = spawnSync("git", ["log", "-1", "--format=%cs", "--", relativePath], {
    cwd: ROOT_DIR,
    encoding: "utf8",
  });

  const gitDate = gitResult.stdout.trim();

  if (gitResult.status === 0 && /^\d{4}-\d{2}-\d{2}$/.test(gitDate)) {
    return gitDate;
  }

  return statSync(filePath).mtime.toISOString().slice(0, 10);
}

function analyzePublicFiles() {
  const entriesByUrl = new Map();
  const skipped = [];

  for (const filePath of collectPublicHtmlFiles()) {
    const routePath = toRoutePath(filePath);
    const basename = path.basename(filePath);
    const html = readFileSync(filePath, "utf8");
    const excludedPattern = findPatternMatch(routePath, basename);
    const excludedReason = excludedPattern
      ? `excluded pattern: ${excludedPattern}`
      : NOINDEX_RE.test(html)
        ? "noindex"
        : null;

    synchronizeSeoTags(filePath, routePath, Boolean(excludedReason));

    if (excludedReason) {
      skipped.push({
        routePath,
        url: toCanonicalUrl(routePath),
        reason: excludedReason,
      });
      continue;
    }

    const url = toCanonicalUrl(routePath);
    const lastmod = getLastModifiedDate(filePath);
    const current = entriesByUrl.get(url);

    if (!current || lastmod > current.lastmod) {
      entriesByUrl.set(url, { url, lastmod, source: filePath });
    }
  }

  const blogIndexPath = path.join(BLOG_DIR, "index.html");

  if (!existsSync(blogIndexPath)) {
    skipped.push({
      routePath: "/blog/",
      url: toCanonicalUrl("/blog/"),
      reason: "missing file: blog/index.html",
    });
  }

  const entries = Array.from(entriesByUrl.values()).sort((left, right) => left.url.localeCompare(right.url));

  return {
    entries,
    skipped: skipped.sort((left, right) => left.url.localeCompare(right.url)),
  };
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderSitemap(entries) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', `<urlset xmlns="${SITEMAP_NAMESPACE}">`];

  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(entry.url)}</loc>`);
    lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>", "");
  return lines.join("\n");
}

function validateEntries(entries) {
  if (entries.length === 0) {
    throw new Error("Refusing to write an empty sitemap.");
  }

  const seenUrls = new Set();
  const sortedUrls = [...entries].map((entry) => entry.url).sort((left, right) => left.localeCompare(right));

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const parsed = new URL(entry.url);

    if (parsed.origin !== SITE_ORIGIN) {
      throw new Error(`Unexpected sitemap host for ${entry.source}: ${entry.url}`);
    }

    if (entry.url !== sortedUrls[index]) {
      throw new Error("Sitemap URLs are not sorted.");
    }

    if (seenUrls.has(entry.url)) {
      throw new Error(`Duplicate sitemap URL: ${entry.url}`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod)) {
      throw new Error(`Invalid lastmod for ${entry.source}: ${entry.lastmod}`);
    }

    seenUrls.add(entry.url);
  }
}

function validateXml(xml) {
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')) {
    throw new Error("Sitemap XML declaration is missing.");
  }

  if (!xml.includes(`<urlset xmlns="${SITEMAP_NAMESPACE}">`)) {
    throw new Error("Sitemap namespace is missing.");
  }

  const openCount = (xml.match(/<url>/g) || []).length;
  const closeCount = (xml.match(/<\/url>/g) || []).length;

  if (openCount === 0 || openCount !== closeCount) {
    throw new Error("Sitemap XML has mismatched <url> elements.");
  }
}

function writeSitemapFiles(xml) {
  writeFileSync(OUTPUT_XML, xml, "utf8");
  writeFileSync(OUTPUT_GZ, gzipSync(xml));
}

function printReport(entries, skipped) {
  const blogCount = entries.filter((entry) => new URL(entry.url).pathname.startsWith("/blog/")).length;

  console.log(`Generated ${entries.length} sitemap URLs.`);
  console.log(`Included ${blogCount} /blog/ URLs.`);

  if (skipped.length === 0) {
    console.log("Skipped 0 URLs.");
    return;
  }

  console.log(`Skipped ${skipped.length} URLs:`);

  for (const item of skipped) {
    console.log(`- ${item.url} (${item.reason})`);
  }
}

function main() {
  if (!existsSync(path.join(ROOT_DIR, ".git"))) {
    throw new Error("Run the sitemap generator from the repository root.");
  }

  const { entries, skipped } = analyzePublicFiles();
  validateEntries(entries);

  const xml = renderSitemap(entries);
  validateXml(xml);
  writeSitemapFiles(xml);
  printReport(entries, skipped);
}

main();
