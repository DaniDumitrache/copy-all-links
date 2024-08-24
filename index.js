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
/** to browser console */
/* 
(function () {
  // Ensure the document is focused
  window.focus();

  // Get the host of the current page
  const siteHost = window.location.host;

  // Get all <a> elements on the page
  const links = document.querySelectorAll("a");

  // Use a Set to store unique URLs
  const uniqueUrls = new Set();

  // Iterate through each link to filter and store internal links
  links.forEach((link) => {
    const href = link.href;

    // Try to construct a new URL object and handle exceptions
    try {
      const url = new URL(href, window.location.origin); // Use window.location.origin as a base URL for relative links
      const linkHost = url.host;

      // Check if the link is an internal link and not a fragment identifier (#)
      if (href && href.indexOf("#") === -1 && linkHost === siteHost) {
        uniqueUrls.add(url.href); // Add the full absolute URL to the set
      }
    } catch (error) {
      // If URL construction fails, log the error and continue
      console.warn(`Skipping invalid URL: ${href}`);
    }
  });

  // Convert the Set to an array and join the links into a single string separated by newlines
  const csvContent = Array.from(uniqueUrls).join("\n");

  // Attempt to copy to clipboard using Clipboard API
 console.log(csvContent)
 console.log(uniqueUrls.size)
})();
*/
