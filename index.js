const express = require('express');
const SSLCommerzPayment = require("sslcommerz");
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')
require('dotenv').config()


app.use(cors())  

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/', async (req, res) => {

  /** 
  * Root url response 
  */

  return res.status(200).json({
    message: "Welcome to sslcommerz gateway",
    url: `${process.env.ROOT}/ssl-request`
  })
})

app.get('/ssl-request/:amount/:orderid', async (req, res) => {

  /** 
  * Create ssl session request 
  */
 console.log(req.params.amount)
 const amount = Number(req.params.amount)
 console.log(amount)

  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: req.params.orderid,
    success_url: `${process.env.ROOT}/ssl-payment-success`,
    fail_url: `${process.env.ROOT}/ssl-payment-fail`,
    cancel_url: `${process.env.ROOT}/ssl-payment-cancel`,
    shipping_method: 'No',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'cust@yahoo.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    multi_card_name: 'mastercard',
    value_a: 'ref001_A',
    value_b: 'ref002_B',
    value_c: 'ref003_C',
    value_d: 'ref004_D',
    ipn_url: `${process.env.ROOT}/ssl-payment-notification`,
  };

  const sslcommerz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false) //true for live default false for sandbox
  sslcommerz.init(data).then(data => {

    //process the response that got from sslcommerz 
    //https://developer.sslcommerz.com/doc/v4/#returned-parameters

    if (data?.GatewayPageURL) {
      return res.status(200).redirect(data?.GatewayPageURL);
    }
    else {
      return res.status(400).json({
        message: "Session was not successful"
      });
    }
  });

});

app.post("/ssl-payment-notification", async (req, res) => {

  /** 
  * If payment notification
  */

  return res.status(200).json(
    {
      data: req.body,
      message: 'Payment notification'
    }
  );
})

app.post("/ssl-payment-success", async (req, res) => {
  console.log('nice')

  /** 
  * If payment successful 
            */



 
    console.log(req.body.tran_id);
    key='consumer_key=ck_7d700d7c05bea9f024076feb890944ad286703f2&consumer_secret=cs_59a8c6db54711f8a9fc314b95e0ad782a946c191'
    bodys = `{"status": "completed"}`
    console.log(bodys)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: bodys,
      redirect: 'follow'
    };
    fetch(`https://shop.abusayeeed.xyz/wp/wp-json/wc/v3/orders/${req.body.tran_id}?`+key, requestOptions)
      .then(response => response.json())
      .then(result => {
        const rslt = result;
        console.log(rslt) })
        



         
  return  res.status(200).json(
    { 
      data: req.body,
      message: 'Payment success',
     
      
    }
   
  );
   

})

app.post("/ssl-payment-fail", async (req, res) => {

  /** 
  * If payment failed 
  */
  
  return res.status(200).json(
    {
      data: req.body,
      message: 'Payment failed'
    }
  );
})

app.post("/ssl-payment-cancel", async (req, res) => {

  /** 
  * If payment cancelled 
  */

  return res.status(200).json(
    {
      data: req.body,
      message: 'Payment cancelled'
    }
  );
})

app.listen(process.env.PORT, () =>
  console.log(`ssl app listening on port ${process.env.PORT}!`),
);

function postWoocommerce() {
  console.log('ok')
}