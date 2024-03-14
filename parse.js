const fs = require("fs");
const pdf = require("pdf-parse");

const { PDFDocument } = require("pdf-lib");

const pdfPath = "./a.pdf";

const pdfBuffer = fs.readFileSync(pdfPath);

console.log(pdfBuffer);

pdf(pdfBuffer).then(function (data) {
  console.log(data.text);
});

// const getpdf = async (pdf) => {
//   const pdfDoc = await PDFDocument.load(pdf);

//   const fieldName = pdfDoc
//     .getForm()
//     .getFields()
//     .map((field) => field);

//   const form = pdfDoc.getForm().getTextField(fieldName[0].getName()).getText();

//   // console.log(form);

//   const pdfBytes = await pdfDoc.save();

//   // fs.writeFile("filePath", pdfBytes, function (err) {
//   //   if (err) {
//   //     return console.error(`Error saving attachment ${filename}:`, err);
//   //   }
//   //   console.log(`Attachment ${index + 1} saved: ${filename}`);
//   // });

//   // const fieldNames = pdfDoc
//   //   .getForm()
//   //   .getFields()
//   //   .map((field) => field);

//   // console.log(fieldNames.map((name) => name));

//   return pdfDoc;
// };

// const pdfDoc = getpdf(pdfBuffer);

// fs.readFile(pdfPath, (err, data) => {
//   if (err) {
//     console.error("Error reading PDF:", err);
//     return;
//   }

//   pdf(data).then(async (pdfData) => {

//   });
// });
