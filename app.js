require('pg');
const express = require('express');
const path = require('path');
const { engine } = require("express-handlebars");
const hbs = require("handlebars");
const db = require('./configs/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');


const cors = require('cors');
const flash = require('connect-flash');

const { Product, User, Review, Cart, CartItem, Order, OrderItem,  Admin } = require('./apps/relationships');

const app = express();


// Để sử dụng biến môi trường trong file .env
require('dotenv').config();

// Passport config
require('./configs/passport')(passport);


// Sử dụng json parser
app.use(express.json());
// Sử dụng x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(session({
    secret: "123",
    resave: false,
    saveUninitialized: false
}));

// Flash middlewares
app.use(flash());

// Passport middlewares
app.use(passport.session());
app.use(passport.initialize());


// Thiết lập view engine là Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));

// Thiết lập thư mục tĩnh
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res) => {
    res.send("OK")
});


// Kết nối database
const connectDB = async () => {
    console.log('Check database connection...');

    try {
        await db.authenticate();
        // Đồng bộ các models
        await db.sync({ force: false });
        console.log('Database connection established');
    } catch (e) {
        console.log('Database connection failed', e);
    }
};

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await connectDB();
        // Khởi động server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
})();

module.exports = app;