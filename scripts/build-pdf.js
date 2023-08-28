// TODO: improve logic and speed here, definitely with some sort of binary searching, and maybe with caching the last successful size
import puppeteer from "puppeteer-core";
import fs from "fs";
import child_process from "child_process";
import * as pdf2json from "pdf2json";

async function pageCount(failureCallback, successCallback) {
  let pdfParser = new pdf2json.default();
  pdfParser.on("pdfParser_dataReady", async (data) => {
    const pageCount =
      data &&
      data.formImage &&
      data.formImage.Pages &&
      data.formImage.Pages.length
        ? data.formImage.Pages.length
        : 0;
    if (pageCount > parseInt(process.argv[2])) {
      failureCallback();
    } else {
      await successCallback();
    }
  });
  pdfParser.loadPDF("build/cv.pdf");
}

async function print(scale, subprocess) {
  // Kerning fix source: https://docs.browserless.io/blog/2020/09/30/puppeteer-print.html
  const browser = await puppeteer.launch({
    executablePath: "chromium",
    args: ["--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  // TODO: pull URL from stdout of dev command
  await page.goto("http://localhost:3000");

  try {
    fs.accessSync("build");
  } catch {
    fs.mkdirSync("build");
  }

  try {
    fs.unlinkSync("build/cv.pdf");
  } catch {
  } finally {
    await page.pdf({ path: "build/cv.pdf", format: "letter", scale: scale });
    await browser.close();
    console.log(`pdf saved with scale ${scale}`);
    await pageCount(
      () => {
        console.log(`page count too high with scale ${scale}`);
        print(scale - 0.01, subprocess);
      },
      () => {
        subprocess.kill("SIGINT");
        console.log("dev server stopped");
      }
    );
  }
}

const subprocess = child_process.spawn("npm", ["run", "dev"]);
let printBegun = false;
subprocess.stdout.on("data", (data) => {
  if (!printBegun && String(data).match(/> Local: http:\/\//g)) {
    printBegun = true;
    console.log("dev server started");
    print(1, subprocess);
  }
});
