
const express = require('express');
const app = express();
var fs = require('fs');


var easyinvoice = require('easyinvoice');

const morgan = require("morgan");
const cors = require("cors");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
const knex = require("knex");
var path = require('path');

app.use(express.static(path.resolve('./')));

// Create database object
const db = knex({
  client: "pg",
  connection: {
    host: 'localhost',
    port: "5432",
    user: "postgres",
    password:"password",
    database: "inventory",
  },
});
const now = new Date()
app.post('/order',(req, res)=>{
    let products= req.body.items;

    db.insert({
    invoice_no : req.body.invoice_no,
    customername : req.body.name,
    customeremail : req.body.mail,
    customerno : req.body.number,
    customeraddress : req.body.address,
    advance:req.body.advance,
    pan:req.body.pan,
    gstn : req.body.gstn,
    tin : req.body.tin,
    customertime : now,
    products : JSON.stringify(products) ,
    subtotal : req.body.subtotal ,
    gst : req.body.gst,
    igst: req.body.igst,
    discount:req.body.discount,
    payment : false,
    paymentmethod : req.body.paymentmethod,
    sgst : req.body.sgst,
    totalprice : req.body.totalprice 
      })
        .into("invoices")
        .then(() => res.json({ success: true }))
        .catch((err) =>
          console.log({ success: false, message: "upload failed", stack: err.stack })
        );
})
app.put('/order',(req, res)=>{
  //let products= req.body.items;

  db.update({
  payment : req.body.payment,
  paymentmethod : req.body.paymentmethod
    })
      .into("invoices")
      .where('invoice_no',req.body.invoice_no)
      .then(() => res.json({ success: true }))
      .catch((err) =>
        console.log({ success: false, message: "upload failed", stack: err.stack })
      );
})
app.get("/order", function (req, res) {
  var count;
  db.raw("SELECT Count(*) from invoices").then((data) => {
    count = data.rows[0].count;
  });
  var page = req.query.page;
  var per_page = req.query.per_page;
  var end = per_page * page;
  var start = end - per_page + 1;
  console.log(start,end)
  db.select("*")
    .from("invoices")
    .whereBetween('id',[start,end])
    .then((data) => res.json({data:data,total:count}))
    .catch((err) =>
      res.status(404).json({
        success: false,
        message: "not found",
        stack: err.stack,
      })
    );
});

app.get('/order/:id',(req,res) => {
  db.select("*")
  .from("invoices")
  .where('invoice_no',req.params.id)
  .then((data) => {
    res.send(data);
  });
})

// app.get('/order',(req,res) => {
//   db.select("*")
//   .from("invoices")
//   .then((data) => {
//     res.send(data);
//   });
// })

app.post('/products',(req,res)=>{
  var cnt;
  db.raw("SELECT Count(*) from products").then((data) => {
    cnt=(data.rows[0].count);
    console.log(cnt);
    cnt=++cnt;
    const yr = new Date().getFullYear();
     db.insert({
       productid:`#${yr}-${cnt}`,
       productname :req.body.name,
       productprice :req.body.price,
       stocks :req.body.stocks
     }).into("products").then(() => res.json({succes:true})).catch((err) =>
     console.log({ success: false, message: "upload failed", stack: err.stack })
   );
  });

})

app.put('/products',(req,res)=>{
  db.update({
    productname :req.body.productname,
    productprice :req.body.productprice,
    stocks :req.body.stocks
  }).into("products").where('productid',req.body.productid).then(() => res.json({succes:true})).catch((err) =>
  console.log({ success: false, message: "upload failed", stack: err.stack })
);
})
app.post("/login", (req, res) => {
  const { userName, password } = req.body;
  db.select("*")
    .from("users")
    .where("username", userName)
    .then((data) => {
      res.send(data[0]);
    });
});
app.get("/customers", function (req, res) {
  var count;
  db.raw("SELECT Count(*) from customers").then((data) => {
    count = data.rows[0].count;
  });
  var page = req.query.page;
  var per_page = req.query.per_page;

  var end = per_page * page;
  var start = end - per_page + 1;
  console.log(start,end)
  db.select("*")
    .from("customers")
    .whereBetween('id',[start,end])
    .then((data) => res.json({data:data,total:count}))
    .catch((err) =>
      res.status(404).json({
        success: false,
        message: "not found",
        stack: err.stack,
      })
    );
});

app.get("/customers/details", function (req, res) {
  db.select("*")
    .from("customers")
    .then((data) => res.json(data))
    .catch((err) =>
      res.status(404).json({
        success: false,
        message: "not found",
        stack: err.stack,
      })
    );
});

app.post('/customer',(req, res)=>{
  console.log(req.body)
  if(req.body.customerid){
    db.select("*")
    .from("customers").where('customerid',req.body.customerid)
    .then((data) => res.json(data))
        .catch((err) =>
          console.log({ success: false, message: "upload failed", stack: err.stack })
        );
  }
  else if(req.body.phonenumber){
    db.select("*")
    .from("customers").where('customerno',req.body.phonenumber)
    .then((data) => res.json(data))
        .catch((err) =>
          console.log({ success: false, message: "upload failed", stack: err.stack })
        );
  }
})

app.post('/customers',(req,res)=>{
  var number = Math.random(); // 0.9394456857981651
  number.toString(36); // '0.xtis06h6'
  var uniqueid = number.toString(36).substr(2, 8); // 'xtis06h6'
  uniqueid.length >= 8;
  var nis=false; // false
   db.select("*").from("customers").then((data)=>{
   //console.log(data);
   
data.filter((d)=>{
    if( d.customeremail === req.body.email){
      nis= true;
    }

   })
   console.log(nis);
   })
   if(!nis){
    db.insert({
      customerid : uniqueid,
      customername : req.body.name,
      customeremail : req.body.email,
      customerno : req.body.number,
      customeraddress : req.body.address,
      pan:req.body.pan,
      tin:req.body.tin,
      gstn:req.body.gstn
    }).into("customers").then(() => res.json({success:true})).catch((err) =>
    console.log({ success: false, message: "upload failed", stack: err.stack })
  );
   }
   else{
     res.json({message:"customer already exists"})
   }
  
})
app.put('/customers',(req,res)=>{
  

  db.update({
    customerid : req.body.customerid,
    customername : req.body.customername,
    customeremail : req.body.customeremail,
    customerno : req.body.customerno,
    customeraddress : req.body.customeraddress,
    pan:req.body.pan,
    tin:req.body.tin,
    gstn:req.body.gstn
  }).into("customers").then(() => res.json({succes:true})).catch((err) =>
  console.log({ success: false, message: "upload failed", stack: err.stack })
);
})




app.post('/product',(req, res)=>{
    db.select("*")
    .from("products")
    .where("productname" , req.body.productname)
    .then((data) => res.json(data))
        .catch((err) =>
          console.log({ success: false, message: "upload failed", stack: err.stack })
        );
})
app.get('/products',(req, res)=>{
    db.select("*")
    .from("products")
    .then((data) => res.json(data))
        .catch((err) =>
          console.log({ success: false, message: "upload failed", stack: err.stack })
        );
})
app.listen(5050, ()=>console.log(`Express Server is running at : http://localhost:5050`))




