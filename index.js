const Imap = require("node-imap");
const simpleParser = require("mailparser").simpleParser;
const fs = require("fs");
const express = require("express");
const { PDFDocument } = require("pdf-lib");
const app = express();
var cron = require("node-cron");

const pdf = require("pdf-parse");

const imap = new Imap({
  user: "firaolbogala98@gmail.com",
  password: "zgkb tuwh gegr roym",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
});

function errorHandler(err) {
  console.error("Error:", err);
}

imap.once("ready", function () {
  imap.openBox("INBOX", true, function (err, box) {
    if (err) {
      return errorHandler(err);
    }

    // Calculate date 2 hours ago
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    imap.search(["UNSEEN", ["SINCE", twoHoursAgo]], function (err, results) {
      if (err) {
        return errorHandler(err);
      }

      const fetch = imap.fetch(results, { bodies: "", struct: true });

      fetch.on("message", function (msg) {
        let attachments = [];

        msg.on("body", function (stream, info) {
          simpleParser(stream, {}, function (err, parsed) {
            if (err) {
              return errorHandler(err);
            }

            console.log("Email Subject:", parsed.subject);

            if (parsed.attachments && parsed.attachments.length > 0) {
              console.log(
                `Email contains ${parsed.attachments.length} attachments`
              );
              attachments = attachments.concat(parsed.attachments);
              attachments.forEach(async function (attachment, index) {
                if (attachment.contentType === "application/pdf") {
                  const pdfBuffer = attachment.content;

                  pdf(pdfBuffer).then(function (data) {
                    console.log(data.text);
                  });

                  const regex = new RegExp("Firaol", "i");

                  try {
                    const pdfDoc = await PDFDocument.load(pdfBuffer);

                    const page = pdfDoc.getPage(0);
                    const content = await page.doc.getForm();
                    console.log(content);

                    // Check if the word exists in the page content
                    const matches = content.items.some((item) =>
                      regex.test(item.str)
                    );

                    console.log("Word found:", matches);

                    const formFields = pdfDoc.getForm().getFields();
                    const formData = formFields.map((field) => ({
                      name: field.getName(),
                      type: field.constructor.name,
                      value: field.getValue(),
                      options: field.getOptions(),
                    }));

                    console.log("Form data:", formData);
                  } catch (error) {
                    console.error("Error extracting forms from PDF:", error);
                  }

                  const filename = attachment.filename;
                  console.log(`Saving attachment ${filename}`);

                  const filePath = filename;

                  fs.writeFile(filePath, attachment.content, function (err) {
                    if (err) {
                      return console.error(
                        `Error saving attachment ${filename}:`,
                        err
                      );
                    }
                    console.log(`Attachment ${index + 1} saved: ${filename}`);
                  });
                }
              });
            }
          });
        });

        msg.once("end", function () {
          console.log("Finished message", attachments);
        });
      });

      fetch.once("all", function (err) {
        console.log("end");
        imap.end();
      });

      fetch.once("end", function () {
        console.log("Done fetching all messages!");
        imap.end();
      });
    });
  });
});

cron.schedule(" */0.01 * * * *", () => {
  console.log("here");
  if (imap.state === "connected") {
    console.log("Already connected");
    imap.end();
  }
  imap.connect();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
