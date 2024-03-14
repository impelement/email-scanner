const Imap = require("node-imap");
const simpleParser = require("mailparser").simpleParser;
const express = require("express");
const app = express();
var cron = require("node-cron");

const imap = new Imap({
  user: "email",
  password: "password",
  host: "email host",
  port: post_number,
  tls: true,
});

function fetchNewEmails() {
  imap.openBox("INBOX", true, function (err, box) {
    if (err) {
      return errorHandler(err);
    }

    const lastchecked = new Date();

    imap.search(["UNSEEN", ["SINCE", lastchecked]], function (err, results) {
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

            if (parsed.attachments) {
              console.log("Email contains attachments");
            }

            console.log("Email Subject:", parsed.subject);
          });
        });
      });
    });
  });
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

cron.schedule("*/1 * * * *", fetchNewEmails);

imap.connect();

function errorHandler(err) {
  console.error("Error:", err);
}
