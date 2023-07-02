const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const puppeteer = require("puppeteer");
const copyPaste = require("copy-paste");
const { URL } = require("url");

console.clear()
console.log(`
 website  : danid.rf.gd
 discord  : danid#5249
 github   : DaniDumitrache
 linkedin : DaniDumitrache
`);

readline.question("site url: ", (url) => {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const parsedUrl = new URL(url);
    const siteHost = parsedUrl.host;

    const urls = await page.$$eval(
      "a",
      (links, host) => {
        const uniqueUrls = new Set();
        return links
          .map((link) => ({
            url: link.href,
            externalLink: link.host !== host,
          }))

          .filter((line) => {
            if (
              line.url &&
              line.url.indexOf("#") === -1 &&
              !uniqueUrls.has(line.url) &&
              line.url.includes(host)
            ) {
              uniqueUrls.add(line.url);
              return true;
            }
            return false;
          });
      },
      siteHost
    );

    await browser.close();

    const csvContent = urls.map((line) => line.url).join("\n");

    copyPaste.copy(csvContent, () => {
      console.log("link-urile au fost copiate în clipboard!");
      console.log(`Au fost copiate ${urls.length} link-uri.`);
    });
    readline.close();
  })();
});
