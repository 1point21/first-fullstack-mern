const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    
    if (!notes?.length) {
        return res.status(400).json({ message: "No notes found" })
    }

    const notesWithUser = await Promise.all(notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec()
      return {...note, username: user.username}
    }))

    res.json(notesWithUser)
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  // get data from body  
  const { user, title, text } = req.body

  // check data received
  if (!user || !title || !text) {
    return res.status(400).json( {message: "All fields are required" })
  }

  // check for duplicates
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
      res.status(409).json({ message: "Duplicate note title"})
    }

    // create note and store
    const note = await Note.create({ user, title, text })

    if (user) {
      res.status(201).json({ message: "New note created" })
    }
    else {
      res.status(400).json({ message: "Invalid data received - try again!" })
    }
});

// @desc Update existing note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  // get data from body
  const { id, user, title, text, completed } = req.body

  // confirm data
  if (!id || !note || !title || !text || typeof completed !== "boolean") {
    res.status(400).json({ message: "All fields are required" })
  }

  // confirm if note exists to update
  const note = await Note.findById(id).exec()

  if (!note) {
    res.status(400).json({ message: "No note found" })
  }

  // check for duplicate title
  const duplicate = await Note.findOne({title}).lean().exec()
  if (duplicate && duplicate?._id.toString() !== id){
    return res.status(409).json({ message: "Duplicate note title" })
  }

  // update note
  note.user = user
  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()

  res.json({ message: `${updatedNote.title} has been updated`})
});



// @desc Delete existing note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  // get data from body
  const { id } = req.body;

  // check data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // get note to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // create reply message
  const result = await note.deleteOne();
  if (result.acknowledged){
    const reply = `Note ${note.title} with ID ${note.id} has been deleted`;
    return res.json({reply});
  }
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
