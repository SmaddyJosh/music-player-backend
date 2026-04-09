const express= require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/user');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://mulijoshua681_db_user:josh@cluster0.2wcqfer.mongodb.net/?appName=Cluster0');

//register route
app.post('/register', async (req, res) => {
    
    try {
        const emailExists= await User.findOne({email: req.body.email});
        if(emailExists) return res.status(400).send('Email already exists');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({message: 'User registered successfully'});
       
    } catch (err) {
        res.status(400).send(err);
    };
});

//login route
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Email not found');

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid password');

        res.status(200).json({
            message: 'Login successful',
            user: {
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({error: 'An error occurred during login'   });
    }
    });
    
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });