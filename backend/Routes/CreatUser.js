const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const jwtSecret = "MynameisYuvrajsandipPise@!"
// for signup 
router.post("/creatuser",
    [
    
        body('email', 'Incorrect email').isEmail(),
        body('name').isLength({ min: 5 }),
        body('password', 'Not valid password').isLength({ min: 5 })
    ]
    , async (req, res) => {
        try {
            // validation of details
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const salt = await bcrypt.genSalt(10);
            let SecPassword = await bcrypt.hash(req.body.password,salt)
            
            await User.create({
                name: req.body.name,
                password:SecPassword ,  // Fix the typo here
                email: req.body.email,
                location: req.body.location
            })
            res.json({ success: true });
        } 
        catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

// for login
router.post("/loginuser",
    [
        body('email', 'Incorrect email').isEmail(),
        body('password', 'Not valid password').isLength({ min: 5 })
    ],
    async (req, res) => {
        let email = req.body.email;

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let userData = await User.findOne({ email })

            if (!userData) {
                return res.status(400).json({ errors: "Try logging with correct credentials" });
            }
            const pswCompare = await bcrypt.compare(req.body.password,userData.password)
            if (!pswCompare) {
                return res.status(400).json({ errors: "Try logging with correct credentials" });
            }

            const data = {
                user:{
                    id : userData.id
                }
            }
            const authToken = jwt.sign(data,jwtSecret)
            return res.json({ success: true , authToken:authToken })
        } 
        
        catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })
module.exports = router;
