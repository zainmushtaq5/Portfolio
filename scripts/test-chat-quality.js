const fs = require('fs');
const path = require('path');
const { cases, check } = require('./chat-quality-cases.js');

const API_URL = 'http://localhost:3000/api/chat';
const OUTPUT_FILE = path.join(__dirname, '..', 'quality-output.txt');

// Wipe old output
if (fs.existsSync(OUTPUT_FILE)) {
  fs.writeFileSync(OUTPUT_FILE, '');
}

function logOutput(text) {
  fs.appendFileSync(OUTPUT_FILE, text + '\n');
}

async function fetchWithRetry(sessionId, message, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: [{ role: 'user', content: message }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        if ((res.status === 503 || res.status === 429) && i < retries) {
          console.log(`[HTTP ${res.status}] Retrying...`);
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        let errJson = {};
        try { errJson = await res.json(); } catch(e) {}
        throw new Error(`API returned ${res.status}: ${errJson.error || res.statusText}`);
      }

      // Stream parsing
      const decoder = new TextDecoder();
      const reader = res.body.getReader();
      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
      }
      return fullContent;
    } catch (e) {
      clearTimeout(timeout);
      if (i === retries) throw e;
      console.log(`Error: ${e.message}, Retrying...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function runTests() {
  logOutput("CHAT QUALITY TEST RESULTS\n========================");
  console.log("Starting Chat Quality Tests...\n");
  
  let passed = 0;
  let failed = 0;
  const results = [];

  for (const c of cases) {
    console.log(`Testing [${c.type}]: "${c.q}"`);
    logOutput(`\nQ: ${c.q}`);
    const sessionId = `test_sess_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    let reply = "";
    let fails = [];
    
    try {
      reply = await fetchWithRetry(sessionId, c.q);
      logOutput(`A: ${reply}`);
      fails = check(c, reply);
    } catch (err) {
      reply = `[REQUEST FAILED: ${err.message}]`;
      fails = ["request failed"];
      logOutput(`A: ${reply}`);
    }

    const pass = fails.length === 0;
    if (pass) passed++; else failed++;

    results.push({
      Type: c.type,
      Question: c.q,
      Result: pass ? "PASS" : "FAIL",
      Reasons: fails.join(", ") || "-"
    });

    await new Promise(r => setTimeout(r, 3000));
  }

  // Print table
  console.table(results);
  
  const summary = `\nRESULTS: ${passed} passed, ${failed} failed.`;
  console.log(summary);
  logOutput(summary);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);
