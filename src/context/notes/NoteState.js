import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    // const s1 = {
    //     "name": "Harry",
    //     "class": "5b"
    // }
    // const [state, setState] = useState(s1)
    // const update = () => {
    //     setTimeout(() => {
    //         setState({
    //             "name": "Larry",
    //             "class": "10b"
    //         }) 
    //     }, 1000);
    // }

    const host = "http://localhost:5000"
    const notesInitial = [ ]
    const [notes, setNotes] = useState(notesInitial)

//Get all Notes
const getNotes = async (title, description, tag) => {
    // console.log(localStorage.getItem('token'))
    //API call

    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",

        headers: {
            "Content-Type": "application/json",
            "auth-token":  localStorage.getItem('token'),
        },

    });


    const json = await response.json()
    // console.log(json)
    setNotes(json)

   

}




    //Add a Note
    const addNote = async (title, description, tag) => {
        //ToDo: API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",

                "auth-token": localStorage.getItem('token'),
            },

            body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
        });
        const jsonNote = await response.json();
        // console.log(jsonNote)
        setNotes(notes.concat(jsonNote))

        //------------logic to add in client----------------------------------------------------------------------------------------------------

        // console.log("Adding a new note")
        // let note = {
        //     "_id": "65464af1e0d651b3d29536c9z11",
        //     "user": "653d3046103fc763867b7f0d",
        //     "title": title,
        //     "description": description,
        //     "tag": tag,
        //     "date": "2023-11-04T13:45:21.202Z",
        //     "__v": 0
        // }
        // setNotes(notes.concat(note))

    }



    //Delete a Note
    const deleteNote = async(id) => {
        //API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token'),
            },

        });
        //eslint-disable-next-line
        const json = await response.json(); // parses JSON response into native JavaScript objects
        // console.log(json)


        // console.log("Deleting the note with id" + id);
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)

    }

    //Edit a Note
    const editNote = async (id, title, description, tag) => {
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token'),
            },

            body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
        });
        // eslint-disable-next-line
        const json = await response.json(); // parses JSON response into native JavaScript objects
        // console.log(json)
 


        //logic to edit in client
        let newNotes = JSON.parse(JSON.stringify(notes))

        for (let index = 0; index < newNotes.length; index++) {
            //this is not working, maybe--- we cant do setnotes 
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        // console.log(newNotes)
        setNotes(newNotes)

    }

    return (

        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote , getNotes }}>
            {/*value={{state, update}} this is an object similar to {state:state, update:update} */}
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;