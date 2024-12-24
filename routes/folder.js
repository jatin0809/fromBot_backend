const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const {Folder} = require("../schema/folder.schema");
const {Form} = require("../schema/form.schema")

//Create folder
router.post("/add", authMiddleware, async (req, res) => {
    try {
      const {name} = req.body;
      const existingFolder = await Folder.findOne({ name, userId: req.user.id});
      if (existingFolder) {
       return res.status(400).json({ message: "Folder with the same name already exists." });
      }
      const folder = new Folder({ userId: req.user.id, name });
      await folder.save();
      res.status(201).json({message: "Folder Created Successfully"});
    } catch (error) {
      res.status(500).json({ message: "Error creating folder", error });
    }
});

// get all folders
router.get("/", authMiddleware, async (req, res) => {
    try {
      const folders = await Folder.find({ userId: req.user.id });
      res.status(200).json(folders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching folders', error });
    }
});

// deleting folder and files inside that
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const {id} = req.params;
      const folder = await Folder.findByIdAndDelete(id);
      if (folder) {
        await Form.deleteMany({ folderId: folder._id });
        res.status(200).json({ message: 'Folder and associated forms deleted' });
      } else {
        res.status(404).json({ message: 'Folder not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting folder', error });
    }
});

module.exports = router;