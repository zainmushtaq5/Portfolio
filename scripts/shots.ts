import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { projects } from "../src/data/projects"; // Assuming we can run this with tsx

async function takeShots() {
  const browser = await chromium.launch();
  const publicDir = path.join(process.cwd(), "public", "projects");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const needsMe: string[] = [];

  for (const project of projects) {
    if (!project.liveUrl) {
      console.log(`Skipping ${project.slug} - no liveUrl`);
      continue;
    }

    console.log(`Processing ${project.slug} (${project.liveUrl})...`);
    try {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 }
      });
      
      const response = await page.goto(project.liveUrl, { waitUntil: "networkidle", timeout: 15000 });
      if (!response || !response.ok() || response.status() === 401 || response.status() === 403) {
        console.warn(`Failed to load ${project.slug} - Status: ${response?.status()}`);
        needsMe.push(project.slug);
        await page.close();
        continue;
      }

      // Check for login / Vercel protection
      const content = await page.content();
      if (content.toLowerCase().includes("vercel") && content.toLowerCase().includes("password")) {
         console.warn(`${project.slug} seems to be behind Vercel protection.`);
         needsMe.push(project.slug);
         await page.close();
         continue;
      }

      // Wait extra 2 seconds
      await page.waitForTimeout(2000);

      const desktopPath = path.join(publicDir, `${project.slug}.webp`);
      await page.screenshot({ 
        path: desktopPath, 
        type: "webp", 
        quality: 80,
        clip: { x: 0, y: 0, width: 1440, height: 900 } // 16:10 crop (1440/900 = 1.6)
      });
      console.log(`Saved desktop screenshot for ${project.slug}`);

      if (project.slug === "al-shifa-chatbot") {
        // also take phone version
        const phonePage = await browser.newPage({
          viewport: { width: 390, height: 844 },
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        });
        await phonePage.goto(project.liveUrl, { waitUntil: "networkidle", timeout: 15000 });
        await phonePage.waitForTimeout(2000);
        
        // For al-shifa-chatbot, ensure no real patient names
        const phoneContent = await phonePage.content();
        if (phoneContent.match(/\b(patient|appointment|dr\.)\b/i) && phoneContent.match(/\b\d{10,11}\b/)) {
            console.warn(`Potential PII found in ${project.slug}. Stopping.`);
            needsMe.push(`${project.slug} (PII detected)`);
        } else {
            const phonePath = path.join(publicDir, `${project.slug}-phone.webp`);
            await phonePage.screenshot({
              path: phonePath,
              type: "webp",
              quality: 80,
              clip: { x: 0, y: 0, width: 390, height: 844 }
            });
            console.log(`Saved phone screenshot for ${project.slug}`);
        }
        await phonePage.close();
      }

      await page.close();

    } catch (e) {
      console.error(`Error taking screenshot for ${project.slug}:`, e);
      needsMe.push(project.slug);
    }
  }

  await browser.close();

  if (needsMe.length > 0) {
    console.log("\n--- NEEDS ME ---");
    console.log("The following projects need manual screenshots:");
    needsMe.forEach(p => console.log("- " + p));
  }
}

takeShots().catch(console.error);
