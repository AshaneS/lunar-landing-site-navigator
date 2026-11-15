import fs from "fs";
import path from "path";

export async function cachedFetch(url: string) {
  // Create a unique filename based on the URL (so different dates save to different files)
  const hash = Buffer.from(url).toString("base64").replace(/[/+=]/g, "").substring(0, 50);
  const cacheDir = path.join(process.cwd(), ".api-cache");
  const cacheFile = path.join(cacheDir, `${hash}.json`);

  // 1. If the file exists, read it instantly!
  if (fs.existsSync(cacheFile)) {
    const data = fs.readFileSync(cacheFile, "utf-8");
    return JSON.parse(data);
  }

  // 2. Otherwise, fetch from NASA
  const res = await fetch(url, {
    headers: { "User-Agent": "LunarDashboard/1.0 (your-email@example.com)" },
  });
  
  const data = await res.json();

  // 3. Save it for next time
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));

  return data;
}