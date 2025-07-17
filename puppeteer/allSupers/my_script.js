import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true  // התעלמות משגיאות תעודת SSL
  });
  const page = await browser.newPage();
  await page.goto('https://www.gov.il/he/departments/legalInfo/cpfta_prices_regulations');

  const storeLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('div.table-responsive table.table.ui-responsive tbody tr td:nth-child(2) a' ));
    return links.map(link => link.href);
  });

  for (const link of storeLinks) {
    await page.goto(link);
    const fileLink = await page.evaluate(() => {
      const pdfLink = document.querySelector('a[href$=".pdf"]');
      return pdfLink ? pdfLink.href : null;
    });

    if (fileLink) {
      const fileName = fileLink.split('/').pop();
      const filePath = `MyApi/${fileName}`;
      const fileStream = fs.createWriteStream(filePath);
      const response = await page.goto(fileLink);
      await response.buffer().then(buffer => {
        fileStream.write(buffer);
      });
      console.log(`Downloaded ${fileName}`);
    }
  }

  await browser.close();
})();
