import React, { useState, useEffect } from 'react';
import { FaCrown, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { getAllNotes, deleteNoteById } from "../services/operations/notesAPI";
import { setTenant } from "../slices/tenantSlice";
import CreateNoteModal from "../components/CreateNoteModal";

const Notes = () => {
  const dispatch = useDispatch();
  const { notes, loading } = useSelector((state) => state.notes);
  const tenant = useSelector((state) => state.tenant);
  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState({ open: false, note: null });

  // Fetch notes on page load
  useEffect(() => {
    if (user?.token) {
      dispatch(getAllNotes());
    }
  }, [dispatch, user]);

  // Update tenant info
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const response = await dispatch(getAllNotes());

      if (response?.payload?.tenant) {
        const tenantData = response.payload.tenant;
        dispatch(
          setTenant({
            slug: tenantData.slug,
            plan: tenantData.plan,
            noteLimit: tenantData.plan === "Pro" ? Infinity : 3,
          })
        );
      }
    };
    fetchData();
  }, [dispatch, user]);

  const tenantName = tenant.slug || "Loading...";
  const plan = tenant.plan || "Free";
  const noteLimit = tenant.noteLimit || 3;
  const userName = user?.name || "Loading...";
  const notesCount = notes.length;

  // Open create modal
  const handleCreateNote = () => setShowModal({ open: true, note: null });

  // Open edit modal
  const handleEditNote = (note) => setShowModal({ open: true, note });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="w-full px-6 py-4 flex justify-between items-center 
                         bg-black/70 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-700/50">
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-xl font-semibold text-white">
            Tenant: <span className="text-yellow-400">{tenantName}</span> | Plan:{" "}
            <span className={`font-bold ${plan === "Pro" ? "text-green-400 animate-pulse" : "text-blue-400"}`}>
              {plan}
            </span>
          </h1>
          <p className="text-sm text-gray-300">Logged in as: <span className="text-white">{userName}</span></p>
        </div>

        <button
          disabled={plan === "Pro"}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md font-medium transition
                      ${plan === "Pro"
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-yellow-500 text-black hover:bg-yellow-400"
                      }`}
        >
          <FaCrown />
          {plan === "Pro" ? "Plan: Pro" : "Upgrade to Pro"}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 p-4 border-r border-gray-300 bg-black/20 backdrop-blur-md">
          {plan === "Pro" || notesCount < noteLimit ? (
            <button
              onClick={handleCreateNote}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 
                         bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition"
            >
              <FaPlus />
              Create Note
            </button>
          ) : (
            <div className="text-sm text-gray-200 text-center p-2">
              Note limit reached (Free Plan)
            </div>
          )}
        </aside>

        {/* Notes Area */}
        <main className="flex-1 p-6">
          {loading ? (
            <p className="text-center text-gray-300">Loading...</p>
          ) : notesCount === 0 ? (
            <div className="text-center text-gray-300">
              <p className="text-lg">You have no notes yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-black/70 p-4 rounded-xl shadow-lg flex flex-col justify-between h-64"
                >
                  <div className="overflow-y-auto mb-4">
                    <h2 className="font-bold text-lg text-yellow-400">{note.title}</h2>
                    <p className="text-gray-200 mt-2 whitespace-pre-wrap">{note.content}</p>
                  </div>

                  <div className="flex justify-end gap-4 mt-2">
                    {/* Edit icon */}
                    <button onClick={() => handleEditNote(note)} className="text-blue-400 hover:text-blue-500 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L12 14l-4 1 1-4 7.5-7.5z"/>
                      </svg>
                    </button>

                    {/* Delete icon */}
                    <button onClick={() => dispatch(deleteNoteById(note._id))} className="text-red-400 hover:text-red-500 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Note Modal */}
      {showModal.open && (
        <CreateNoteModal
          note={showModal.note} // null for create, note object for edit
          onClose={() => setShowModal({ open: false, note: null })}
        />
      )}
    </div>
  );
};

export default Notes;



