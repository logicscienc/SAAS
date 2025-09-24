import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: [],       // Stores all notes for the logged-in user's tenant
  loading: false,  // Loading state for API calls
  error: null,     // Any error message
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    //  Set all notes at once (GET /note)
    setNotes(state, action) {
      state.notes = action.payload;
    },

    // Add a new note (POST /note)
    addNote(state, action) {
      state.notes.push(action.payload);
    },

    //  Update an existing note (PUT /note/:id)
    updateNote(state, action) {
      const index = state.notes.findIndex(n => n._id === action.payload._id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },

    //  Delete a note (DELETE /note/:id)
    deleteNote(state, action) {
      state.notes = state.notes.filter(n => n._id !== action.payload);
    },

    //  Loading & Error states
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { 
  setNotes, 
  addNote, 
  updateNote, 
  deleteNote, 
  setLoading, 
  setError 
} = notesSlice.actions;

export default notesSlice.reducer;

