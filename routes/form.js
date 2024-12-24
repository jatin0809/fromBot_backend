const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const {Folder} = require("../schema/folder.schema");
const {Form} = require("../schema/form.schema");

// Adding the form
router.post("/add", authMiddleware, async (req, res) => {
    try {
      const {folderId, name, data} = req.body;
      const existingForm = await Form.findOne({ name, folderId});
      if (existingForm) {
       return res.status(400).json({ message: "Form with the same name already exists." });
      }
      const form = new Form({ folderId, name, data });
      await form.save();
  
      res.status(201).json(form);
    } catch (error) {
      res.status(500).json({ message: 'Error creating form', error });
    }
});
 // deleting form
 router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({ _id: req.params.id });
    if (form) {
      await Folder.findByIdAndUpdate(form.folderId, { $pull: { forms: { formId: form._id } } });
      res.status(200).json({ message: 'Form deleted' });
    } else {
      res.status(404).json({ message: 'Form not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting form', error });
  }
});





  module.exports = router;