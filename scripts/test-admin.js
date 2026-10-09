/* eslint-disable */
const http = require("http");

async function run() {
  console.log("Testing Admin flow end-to-end...");
  let cookie = "";

  // 1. Login
  const loginRes = await fetch("http://localhost:3001/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `password=${process.env.ADMIN_PASSWORD || "change-me-before-deploying"}`,
    redirect: "manual",
  });
  const setCookie = loginRes.headers.get("set-cookie");
  console.log("Login Set-Cookie:", setCookie ? "YES" : "NO");
  if (setCookie) {
    cookie = setCookie.split(";")[0];
  }

  // 2. Open /admin
  const adminRes = await fetch("http://localhost:3001/admin", {
    headers: { cookie },
    redirect: "manual"
  });
  console.log("/admin status:", adminRes.status);
  
  // 3. Logout
  const logoutRes = await fetch("http://localhost:3001/api/admin/logout", {
    method: "POST",
    headers: { cookie },
    redirect: "manual"
  });
  const logoutCookie = logoutRes.headers.get("set-cookie");
  console.log("Logout Set-Cookie:", logoutCookie ? "YES" : "NO");
  
  // 4. Open /admin again
  const adminRes2 = await fetch("http://localhost:3001/admin", {
    headers: { cookie: logoutCookie ? logoutCookie.split(";")[0] : "" },
    redirect: "manual"
  });
  console.log("Logged out /admin status:", adminRes2.status);
}

run().catch(console.error);
