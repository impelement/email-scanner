// const PDFExtract = require("pdf.js-extract").PDFExtract;
// const pdfExtract = new PDFExtract();
// const fs = require("fs");
// const buffer = fs.readFileSync("./f1099s.pdf");
// console.log(buffer, typeof buffer);
// const options = {}; /* see below */
// pdfExtract.extractBuffer(buffer, options, (err, data) => {
//   if (err) return console.log(err);
//   console.log(
//     data.pages.map((page) => {
//       console.log(page.content.length);
//     })
//   );
// });

const details = require("./json.json");

details.pages.map((page) =>
  page.content.map((content) => {
    console.log(content.str);
  })
);
