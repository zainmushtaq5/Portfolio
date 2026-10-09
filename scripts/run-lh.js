/* eslint-disable */
const { execSync } = require("child_process");
const fs = require("fs");

const urls = ["http://localhost:3000/", "http://localhost:3000/projects", "http://localhost:3000/about", "http://localhost:3000/contact"];

for (const url of urls) {
  console.log(`Running Lighthouse for ${url}...`);
  try {
    const outputName = `lh-${url.split("/").pop() || "home"}.json`;
    execSync(`npx lighthouse ${url} --chrome-flags="--headless" --output json --output-path ${outputName}`, { stdio: "inherit" });
    const data = JSON.parse(fs.readFileSync(outputName, "utf8"));
    const scores = {
      Performance: Math.round(data.categories.performance.score * 100),
      Accessibility: Math.round(data.categories.accessibility.score * 100),
      "Best Practices": Math.round(data.categories["best-practices"].score * 100),
      SEO: Math.round(data.categories.seo.score * 100),
    };
    console.log(`Scores for ${url}:`, scores);
  } catch (err) {
    console.log(`Failed for ${url}:`, err.message);
  }
}
