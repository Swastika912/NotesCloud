const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")
// jwt authentication - provides client server security (verifies to server that the client is who it claims to be)
const JWT_SECRET = "thisisnice";

// router.get('/' , (req, res)=>{
//    console.log(req.body)

//    const user = User(req.body)
//    user.save()
//    res.send(req.body)
// })


//Route 1: Create a User using: POST "/api/auth/createuser" in ThunderClient. No login required

// Post is used instead of get coz post doesn't give password to url (doesn't reveal the psswrd), use post if more data is to be sent
router.post('/createuser', [
   body('name', "enter a valid name").isLength({ min: 3 }),
   body('email', "enter a val  id email").isEmail(),
   body('password', "Password must be atleast 5 characters long").isLength({ min: 5 }),

], async (req, res) => {
   let success = false;

   console.log(req.body)
   // If there are errors, return Bad request and the errors , the 2nd argument is express-validator
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
   }

   // encryption by bcryptjs (hashing it with salt(random string))
   const salt = await bcrypt.genSalt(10)
   const secpass = await bcrypt.hash(req.body.password, salt)


   // check whether the user with same email exists
   try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
         return res.status(400).json({success, error: "user with same email already exists" })
      }
      user = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: secpass
      })
      // token sent as response with jwt auth
      const data = {
         user: {
            id: user.id
         }
      }
      // console.log(user)
      const authtoken = jwt.sign(data, JWT_SECRET)
      // console.log(jwtdata)  jwtdata renamed to authtoken
      // res.json(user)
      success= true;
      res.json({success, authtoken })

   } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server error ')

   }
   // .then(user => res.json(user))
   // .catch(err=> {console.log(err)n
   // res.json({error: "Please enter an unique value for email", msg: err.message})});
   // const user = User(req.body)
   // user.save()
   // res.send(req.body)

})


//Route 2: Authenticate a User using: POST "/api/auth/login" in ThunderClient. No login required
router.post('/login', [
   
   body('email', "enter a valid email").isEmail(),
   body('password', "Password must be atleast 5 characters long").isLength({ min: 5 }),

], async (req, res) => {
   let success = false;

   // If there are errors, return Bad request and the errors
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
   }

   const { email, password } = req.body;
   try {

      // checking if the email entered exist or not
      let user = await User.findOne({ email })
      if (!user) {
         success = false;
         return res.status(400).json({success, error: "Please try to login with correct credentials" });
      }

      // now we will compare the password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
         success = false;
         return res.status(400).json({success, error: "Please try to login with correct credentials" });
      }
      // if everything is fine then we will send the user his token
      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET)
      success = true;
      res.json({success , authtoken })

   } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server error ')
   }
})

// Route 3: get loggedin User details using: POST "/api/auth/getuser". Login required
//here we have to extract id from auth token
router.post('/getuser',fetchuser,  async (req, res) => {  
try {
   const userId = req.user.id;
   const user = await User.findById(userId).select("-password")
   res.send(user)
} catch (error) {
   console.log(error.message);
   res.status(500).send('Internal server error ')
}
})  

module.exports = router