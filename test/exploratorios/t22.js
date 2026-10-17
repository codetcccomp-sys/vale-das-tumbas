const {open}=require('../lib');
(async()=>{const {browser,page}=await open();
console.log(await page.evaluate(()=>({compat:document.compatMode,se:!!document.scrollingElement,body:!!document.body,doc:document.documentElement.scrollTop,sh:document.documentElement.scrollHeight,ih:innerHeight,bs:document.body.scrollTop})));
await browser.close();})();
