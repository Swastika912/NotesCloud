const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser")
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');




// ROUTE 1: Get All the notes using : GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error ')
    }

})

// ROUTE 2: Add a new note using : POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', "enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be atleast 5 characters long").isLength({ min: 5 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;  //destructuring 
        //this is express validator
        const errors = validationResult(req)
        if (!errors.isEmpty()) {        //IF THERE IS ERROR, THIS RUNS
            return res.status(400).json({ errors: errors.array() });
        }

        let note = new Note({   // we are storing in note the title,desc,tag we've given and user's id from fetchuser middleware
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();   // we are saving the note
        res.json(savedNote)
        // console.log(savedNote)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error ')
    }
})

// ROUTE 3: Update note using : PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {  // for updation we use put request
    const { title, description, tag } = req.body;  //destructuring 
    try {//try catch is used becoz if there database is down or something like that , the error will be handled

        //Create newnote object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }
        //Allow updation only if user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }) //new:true -- new content gets created
        res.json({ note })
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error ')
    }

})


// ROUTE 4: Delete an existing note using : DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {  // for deletion we use delete request
    // const { title, description, tag } = req.body;  //destructuring 
    try {


        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }

        //Allow deletion only if user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted", note: note })
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error ')
    }

})


module.exports = router;