CREATE DATABASE inventory;

CREATE TABLE products(
id SERIAL PRIMARY KEY,
productid VARCHAR NOT NULL,
productname VARCHAR(255) NOT NULL,
productprice INTEGER NOT NULL,
stocks INTEGER NOT NULL
);


CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    customerid VARCHAR(255),
    customername VARCHAR(255),
    customeremail VARCHAR(255),
    customerno VARCHAR(255),
    customeraddress VARCHAR(255),
    pan VARCHAR(255),
    tin VARCHAR(255),
    gstn VARCHAR(255)
);


CREATE TABLE invoices(
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(255),
    customername VARCHAR(255),
    customeremail VARCHAR(255),
    customerno VARCHAR(255),
    customeraddress VARCHAR(255),
    customertime TIMESTAMP,
    pan VARCHAR(255),
    gstn VARCHAR(255),
    tin VARCHAR(255),
    products JSONB,
    subtotal VARCHAR(255),
    gst VARCHAR(255),
    sgst VARCHAR(255),
    igst VARCHAR(255),
    paymentmethod VARCHAR(255),
    payment BOOLEAN,
    discount VARCHAR(255),
    advance VARCHAR(255),
    totalprice VARCHAR(255)
);

CREATE TABLE users(
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
