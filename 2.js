const express = require("express");
const app = express();
const escape = require('escape-html');
const url = require("url");
const adminSecret = process.env.ADMIN_SECRET;

function checkUrl(urlToCheck) {
  try {
      const {protocol, host} = url.parse(urlToCheck);
      if (protocol !== "https:" || host !== "nc.bank")
          return false;
      return true;
  } catch (err) {
      return false;
  }
}

app.get("/invoice", (req, res) => {
    const id = req.query.id;

    if (!id) {
      return res.status(400).send('id is required');
    }

    const invoiceIdRegex = /^[a-f0-9]{64}$/;
    const match = id.match(invoiceIdRegex);
    const asExpected = match !== null;

    if (!asExpected) {
        return res.status(400).send('invalid invoice id');
    }

    let html = `
        <!DOCTYPE html>
        <head>
        <title>Show invoice</title>
        </head>
        <body>
        <p>Invoice search system is not working. Can't search for ` + id + `</p>
        </body>
        </html>`;
    res.send(html);
  });


  app.get("/redirect", (req, res) => {
    const to = req.query.to;

    if (!to) {
      return res.status(400).send('to is required');
    }

    if (checkUrl(to)) {
      res.redirect(to)
  }
  else {
    return res.status(400).send('Invalid URL');
  }
  });

  app.get("/invoice/delete", (req, res) => {
    const id = req.query.id;

    if (!id) {
      return res.status(400).send('id is required');
    }

    const invoiceIdRegex = /^[a-f0-9]{64}$/;
    const match = id.match(invoiceIdRegex);
    const asExpected = match !== null;

    if (!asExpected) {
        return res.status(400).send('invalid invoice id');
    }

    const secretKey = req.headers['admin_secret']

    if (adminSecret !== secretKey) {
      return res.status(401).send();
    }

    res.json({status: 'Success'})

  });


app.get("/forms", (req, res) => {
    const list = req.query.list;

    if (!list) {
      return res.status(400).send('list is required');
    }

    const array = list.split(',');
    const on = req.query.on;

    let html = `
        <!DOCTYPE html>
        <head>
        <title>List of required forms</title>
        </head>
        <body>
        <h3>Please fill the forms below:</h3>
        <div>
        <ul>`;

    array.forEach((item) => {
        const escapedItem = escape(item);
        if (!on) {
            html += `<li><a href="/${escapedItem}">${escapedItem}</a></li>`;
        }
        else {
            html += `<li><a href="https://${on}/${escapedItem}">${escapedItem}</a></li>`;
        }
    });

    html += `</ul>
        </div>
        </body>
        </html>`;
        
    res.send(html);
  });


app.listen(1337, () => {
  console.log("Server listening on port 1337");
});