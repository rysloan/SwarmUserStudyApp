const express = require('express')
const app = express()
const port = process.env.PORT || 5001

const merchant_model = require('./merchantModel')

const path = require('path')

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../video-picker/build')))

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../video-picker/build/index.html'))
})

app.use(express.json())
app.use(function (req, res, next) {
  // Allow requests from this specific origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow the following HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // Allow the following headers in requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

// instructs Node.js to bypass SSL/TLS certificate verification for outgoing HTTPS requests
// can be risky
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.get('/', (req, res) => {
  merchant_model.getBehaviorData()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/behaviordata', (req, res) => {
  merchant_model.createBehaviorData(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

// app.delete('/merchants/:id', (req, res) => {
//   merchant_model.deleteMerchant(req.params.id)
//   .then(response => {
//     res.status(200).send(response);
//   })
//   .catch(error => {
//     res.status(500).send(error);
//   })
// })

// app.put("/merchants/:id", (req, res) => {
//   const id = req.params.id;
//   const body = req.body;
//   merchant_model
//     .updateMerchant(id, body)
//     .then((response) => {
//       res.status(200).send(response);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})