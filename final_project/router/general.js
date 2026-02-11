const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if(users.find(user => user.username === username)){
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get('http://localhost:5000/all');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
 try {
  const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
  res.status(200).json(response.data);    
 }
  catch (error) {
    res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
 try {
  const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
  res.status(200).json(response.data);
 } catch (error) {
  res.status(404).json({ message: "Title not found" });
 }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews,null,4))
});

module.exports.general = public_users;
