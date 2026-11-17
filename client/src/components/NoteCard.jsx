function NoteCard({ note, onDelete }) {
  return (
    <div className="note">
      <div>
        <h3>{note.title}</h3>
        <p>{note.content}</p>
        <small>{new Date(note.created_at).toLocaleString('uk-UA')}</small>
      </div>
      <button className="delete" onClick={() => onDelete(note.id)}>
        Видалити
      </button>
    </div>
  );
}

export default NoteCard;