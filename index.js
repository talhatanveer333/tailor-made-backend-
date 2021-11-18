const config=require('config');
const express = require('express');
const app=express();
const mongoose=require('mongoose');

const users=require('./routes/user');
const auth=require('./routes/auth');
const products=require('./routes/product');
const customers=require('./routes/customer');
require('./startup/prod')(app);

if(!config.get('jwtPrivateKey')){
    console.log('jwtPrivateKey is not set in environment variables!');
    process.exit(1);
}

// Middleware
// mongoose.connect('mongodb+srv://talha:admin@cluster0.5icx5.mongodb.net/posData?retryWrites=true&w=majority',
//     { useUnifiedTopology: true, })
//     .then(() => console.log('Connected to the database....'))
//     .catch((err) => console.log('Connection error!', err));
mongoose.connect('mongodb://localhost/tailorMadeDatabase')
.then(() => console.log('Connected to the local database....'))
.catch((err) => console.log('Connection error!', err));

app.use(express.json());

//// Endpoints
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/customers', customers);

app.get('/', (req, res)=> {
    res.send('POS backend is running and live!');
})

// Server
const port=process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}...`));
