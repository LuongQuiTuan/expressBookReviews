const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    const token = req.session.authorization;
    if(!token){
        return res.status(403).json({message: "User not logged in"});
    }
    try {
        const decoded = jwt.verify(token, 'access');
        req.user = decoded;
        next();
    } catch (err) {
       return res.status(401).json({ message: "Invalid access token" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
const books = require("./router/booksdb.js");
app.get('/all',function (req,res){
    res.json(books);
});
app.get('/isbn/:isbn',function (req,res){
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book){
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }       
});
app.get('/author/:author',function (req,res){
    const author = req.params.author;
    let booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: "Author not found" });
    }
    res.json(booksByAuthor);
});
app.get('/title/:title',function (req,res){
    const title = req.params.title.toLowerCase();
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
    if (booksByTitle.length === 0) {
        return res.status(404).json({ message: "Title not found" });
    }
    res.json(booksByTitle);
});
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
