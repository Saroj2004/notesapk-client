import React, { useEffect, useState } from "react";
import "./Dash.css";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "User", id: "" });
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [currentNote, setCurrentNote] = useState({ _id: "", title: "", content: "" });
  const [filter, setFilter] = useState("all"); // "all" or "favorites"

  // Load user and notes on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchNotes(parsedUser.id);
    }
  }, []);

  // Fetch notes from backend
  const fetchNotes = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes?userId=${userId}`);
      const data = await res.json();

      // ensure notes include favorite property (default false)
      const notesWithFav = data.map((n) => ({ ...n, favorite: n.favorite || false }));
      setNotes(notesWithFav);
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Add or Edit note
  const handleSaveNote = async () => {
    if (!currentNote.title || !currentNote.content) return alert("Fill all fields");

    const url =
      modalType === "add"
        ? "http://localhost:5000/api/notes"
        : `http://localhost:5000/api/notes/${currentNote._id}`;

    const method = modalType === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          modalType === "add" ? { ...currentNote, user: user.id } : currentNote
        ),
      });

      const data = await res.json();

      if (modalType === "add") {
        setNotes([{ ...data, favorite: false }, ...notes]);
      } else {
        setNotes(notes.map((note) => (note._id === data._id ? { ...data, favorite: note.favorite } : note)));
      }

      setShowModal(false);
      setCurrentNote({ _id: "", title: "", content: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, { method: "DELETE" });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Favorite (frontend only)
  const handleFavorite = (id) => {
    setNotes(
      notes.map((note) =>
        note._id === id ? { ...note, favorite: !note.favorite } : note
      )
    );
  };

  // Filter notes
  const filteredNotes =
    filter === "favorites" ? notes.filter((n) => n.favorite) : notes;

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="Sidebar">
        <h2>Noteflow</h2>
        <ul>
          <li onClick={() => setFilter("all")}>All Notes</li>
          <li onClick={() => setFilter("favorites")}>Favorites</li>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content1">
        <header>
          <h1>Welcome, {user.name}!</h1>
        </header>

        {/* Notes */}
        <section className="notes-section">
          {filteredNotes.length === 0 ? (
            <p>No notes yet</p>
          ) : (
            filteredNotes.map((note) => (
              <div key={note._id} className="note-card">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <div className="note-actions">
                  <button
                    onClick={() => {
                      setModalType("edit");
                      setCurrentNote(note);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note._id)}>Delete</button>
                  <button className="fav" onClick={() => handleFavorite(note._id)}>
                    {note.favorite ? "★" : "☆"}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Add Note Button */}
        <button
          className="add-note-btn"
          onClick={() => {
            setModalType("add");
            setCurrentNote({ title: "", content: "" });
            setShowModal(true);
          }}
        >
          + Add Note
        </button>

        {/* Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{modalType === "add" ? "Add New Note" : "Edit Note"}</h2>
              <input
                type="text"
                placeholder="Title"
                value={currentNote.title}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, title: e.target.value })
                }
              />
              <textarea
                placeholder="Content"
                value={currentNote.content}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, content: e.target.value })
                }
              />
              <button style={{cursor:"pointer"}} onClick={handleSaveNote}>Save</button>
              <button style={{cursor:"pointer"}}  onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
