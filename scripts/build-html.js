import puppeteer from 'puppeteer';
import fs from 'fs';
import child_process from 'child_process';

async function save(subprocess) {
  const browser = await puppeteer.launch({ executablePath: "/usr/bin/brave" });
  const page = await browser.newPage();
  // TODO: pull URL from stdout of dev command
  await page.goto('http://localhost:3000');

  try {
    fs.accessSync('build');
  } catch {
    fs.mkdirSync('build');
  }

  try {
    fs.unlinkSync('build/cv.html');
  } catch { } finally {
    const HTML = await page.content();
    // TODO: do this with a more intelligent tool
    const scriptLessHTML = HTML.replace(/<script.*<\/script>/gi, "");
    fs.writeFileSync('build/cv.html', scriptLessHTML);
    await browser.close();
    console.log('html saved');
    subprocess.kill('SIGINT');
    console.log("dev server stopped");
  }
}

const subprocess = child_process.spawn("npm", ["run", "dev"])
let saveBegun = false;
subprocess.stdout.on('data', (data) => {
  if (!saveBegun && String(data).match(/> Local: http:\/\//g)) {
    saveBegun = true;
    console.log("dev server started")
    save(subprocess);
  }
})
