const http = require("http");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/about",
  "/projects",
  "/projects/al-shifa-chatbot",
  "/projects/plant-disease-detection",
  "/projects/song-website",
  "/projects/text-to-motion",
  "/projects/jarvis-voice-assistant",
  "/projects/pdf-ocr-reader",
  "/projects/prize-bond-checker-pwa",
  "/projects/prize-bond-checker",
  "/services",
  "/contact",
  "/achievements",
  "/resume"
];

async function fetchHtml(route) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${route}`, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, html: data }));
    }).on("error", reject);
  });
}

async function run() {
  console.log("Running SEO Check...\n");
  const results = [];
  let hasFailures = false;

  for (const route of routes) {
    console.log(`Checking ${route}...`);
    try {
      const { status, html } = await fetchHtml(route);
      
      const $ = cheerio.load(html);
      
      const h1s = $("h1").length;
      const title = $("title").text();
      const desc = $("meta[name='description']").attr("content") || "";
      const canonical = $("link[rel='canonical']").attr("href") || "";
      const ogTitle = $("meta[property='og:title']").attr("content") || "";
      const ogDesc = $("meta[property='og:description']").attr("content") || "";
      const noindex = $("meta[name='robots']").attr("content")?.includes("noindex") || false;
      
      let jsonLdParses = true;
      $("script[type='application/ld+json']").each((_, el) => {
        try { JSON.parse($(el).html()); }
        catch (e) { jsonLdParses = false; }
      });

      // Images without alt
      const imagesWithoutAlt = $("img:not([alt])").length;

      const isResume = route === "/resume";
      
      const pass = {
        status: status === 200,
        h1: h1s === 1,
        title: title.length <= 60 && title.length > 0,
        desc: desc.length >= 100 && desc.length <= 160,
        canonical: canonical === `${BASE_URL}${route}` || canonical === `${BASE_URL}`,
        ogTitle: !!ogTitle,
        ogDesc: !!ogDesc,
        jsonLd: jsonLdParses,
        noindex: isResume ? noindex === true : noindex === false,
        alt: imagesWithoutAlt === 0
      };

      const allPass = Object.values(pass).every(v => v === true);
      if (!allPass) hasFailures = true;

      results.push({
        Route: route,
        Status: status,
        "H1s": h1s,
        "Title Len": title.length,
        "Desc Len": desc.length,
        "Canonical": pass.canonical ? "Yes" : "No",
        "OG Data": pass.ogTitle && pass.ogDesc ? "Yes" : "No",
        "JSON-LD": jsonLdParses ? "Yes" : "No",
        "Indexable": !noindex ? "Yes" : "No",
        "PASS": allPass ? "PASS" : "FAIL"
      });

      if (!allPass) {
        console.error(`  FAIL details for ${route}:`, pass);
      }
    } catch (err) {
      console.error(`  Error fetching ${route}:`, err.message);
      hasFailures = true;
    }
  }

  console.table(results);

  const report = results.map(r => Object.values(r).join("\t")).join("\n");
  fs.writeFileSync("seo-report.txt", report);

  if (hasFailures) {
    console.error("\nSEO Check FAILED. Fix issues and rerun.");
    process.exit(1);
  } else {
    console.log("\nSEO Check PASSED!");
  }
}

run();
