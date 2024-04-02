import { interfaceNote } from '../model/interfaceNote.ts'

const Note = (props: {note: interfaceNote, toggleImportance:(id:string) => () => void}) => {
  const {note, toggleImportance} = props;

  const label: string = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      {note.content}
      <button onClick={toggleImportance(note.id!)}>{label}</button>
    </li>
  )
}

const Notes = (props: {notes: interfaceNote[], toggleImportance: (id:string) => () => void}) => {
  const {notes, toggleImportance} = props;
  
  const unlistedNotes: JSX.Element[] = notes.map((note) => 
    <Note 
      key={note.id} 
      note={note} 
      toggleImportance={toggleImportance}
    />
  );

  return (
    <>
      <ul>
        {unlistedNotes}
      </ul>
    </>
  );
}

export default Notes