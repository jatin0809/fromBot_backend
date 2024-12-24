const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const {User} = require("../schema/user.schema");
const authMiddleware = require("../middlewares/auth");


// register
router.post("/register", async (req, res)=>{
    const {name, email, password} = req.body;
    const ifUserExists = await User.findOne({email});
    if(ifUserExists){
        return res.status(400).json({message: "User Already Exists"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashedPassword})
    await user.save();
    res.status(201).json({message: "User Created Successfully"});
})

// get all Users
router.get("/", async (req, res)=>{
    const users = await User.find({}).select("-password");
    res.status(200).json({users});
})

// get user by id
router.get("/:id", async (req, res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user);
})

// login
router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({message: "Wrong email or password"});
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        return res.status(401).json({message: "wrong email or password"});
    }
    const userId = user._id;
    const payload = {id:user._id};
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({token, userId});
})

// share Worksace
router.post('/share', authMiddleware, async (req, res) => {
    try {
      const {email, permission} = req.body;
      const userToShareWith = await User.findOne({ email });
      if (!userToShareWith) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add shared workspace with permission
      userToShareWith.sharedWorkspaces.push({ userId: req.user.id, permission: permission });
      await userToShareWith.save();
  
      res.status(200).json({ message: `Workspace shared with ${userToShareWith.email}` });
    } catch (error) {
      res.status(500).json({ message: 'Error sharing workspace', error });
    }
  });


module.exports = router;