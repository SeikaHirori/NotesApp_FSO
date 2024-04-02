import { SetStateAction, useState, useEffect } from 'react'
import noteService from './services/notes.ts'

import { interfaceNote } from './model/interfaceNote.ts'
import Notes from './components/Notes.tsx'; /**
 * Section: Filtering Displayed Elements
 * 
 * https://arc.net/l/quote/fetgyets
 *  */

import NotificationEr from './components/Notification.tsx';
import Footer from './components/Footer.tsx';



function App() {
  const [notes, setNotes] = useState<interfaceNote[]>(null);
  const [newNote, setNewNote] = useState<string>('a new note...')
  const [showAll, setShowAll] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    console.log('effect run');
    

    noteService
      .getAll()
      .then(initalNotes => {
        setNotes(initalNotes)
      })
  
  }, []);

  const addNote = (event: { preventDefault: () => void; target: any; }) => {
    event.preventDefault();
    const noteObject: interfaceNote = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      });

    
  }

  const toggleImportanceOf = (id: string) => () => {    
    const note: interfaceNote | undefined = notes.find(n => n.id === id);
    
    // RFER: Handling undefined if element is not found from array's "find"
    // https://stackoverflow.com/questions/54738221/typescript-array-find-possibly-undefined#:~:text=lookup.data)%3B-,Solution,-Since%20this%20can
    if (note === undefined) {
      throw new TypeError('Note was not found.')
    }
    
    const changedNote: interfaceNote = {
      ...note, 
      important: !note?.important
    }
    
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(
          notes.map(note => 
            note.id !== id ? note : returnedNote
          )
        )
      })
      .catch(error => {
        const errorMessage: string = `the note "${note.content}" was already deleted from server`;
        setErrorMessage(errorMessage);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);

        setNotes(notes.filter(n => n.id !== id))
      });


  }

  const handleNoteChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }

  const handleShowAll = () => {
    setShowAll(!showAll);
  }
  
  const notesToShow: interfaceNote[] = showAll
    ? notes
    : notes.filter(note => note.important === true);

  if (!notes) {
    return null;
  }

  return (
    <>
      <h1>Notes</h1>
      <NotificationEr message={errorMessage} />
      <div>
        <button onClick={handleShowAll}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <Notes notes={notesToShow} toggleImportance={toggleImportanceOf}/>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
        />
        <button 
          type='submit'>
            save
        </button>
      </form>

      <Footer />
    </>
  )
}

export default App
