import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import NoteCard from './components/NoteCard';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Завантаження нотаток із бази при відкритті сторінки
  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setNotes(data);
  }

  // Додавання нотатки
  async function addNote(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const { data, error } = await supabase
      .from('notes')
      .insert({ title, content })
      .select()
      .single();
    if (error) {
      setError(error.message);
      return;
    }
    setNotes([data, ...notes]);
    setTitle('');
    setContent('');
  }

  // Видалення нотатки
  async function deleteNote(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      setError(error.message);
      return;
    }
    setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <div className="app">
      <h1>SmartAssist: Нотатки</h1>
      <p className="subtitle">React + Supabase (PostgreSQL)</p>

      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={addNote}>
        <input
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Текст нотатки"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Додати нотатку</button>
      </form>

      {notes.length === 0 ? (
        <p className="empty">Поки що немає нотаток</p>
      ) : (
        notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={deleteNote} />
        ))
      )}
    </div>
  );
}

export default App;