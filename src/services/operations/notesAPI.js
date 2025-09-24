import { apiConnector } from "../apiConnector";
import { notesEndpoints } from "../apis";
import { setNotes, addNote, updateNote, deleteNote, setLoading } from "../../slices/notesSlice";
import { toast } from "react-hot-toast";
import { setTenant } from "../../slices/tenantSlice";

/**
 * Fetch all notes for the logged-in tenant
 */
export const getAllNotes = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) return toast.error("Not authenticated");

    try {
      dispatch(setLoading(true));

      const response = await apiConnector("GET", notesEndpoints.GET_ALL_NOTES_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) throw new Error(response.data.message);

      // Update notes
      dispatch(setNotes(response.data.notes || []));

      // Update tenant info in Redux
      if (response.data.tenant) {
        const tenantData = {
          slug: response.data.tenant.slug,
          plan: response.data.tenant.plan,
          noteLimit: response.data.tenant.plan === "Free" ? 3 : Infinity,
        };
        dispatch(setTenant(tenantData));
      }

    } catch (error) {
      console.error("Get all notes error:", error);
      toast.error(error.message || "Failed to fetch notes");
    } finally {
      dispatch(setLoading(false));
    }
  };
};


/**
 * Create a new note
 * @param {object} noteData { title, description }
 */
export const createNote = (noteData) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) return toast.error("Not authenticated");

    try {
      dispatch(setLoading(true));

      const response = await apiConnector("POST", notesEndpoints.CREATE_NOTE_API, noteData, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) throw new Error(response.data.message);

      dispatch(addNote(response.data.data));
      toast.success("Note created successfully!");
    } catch (error) {
      console.error("Create note error:", error);
      toast.error(error.message || "Failed to create note");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * Update a note by ID
 * @param {string} noteId
 * @param {object} noteData { title, description }
 */
export const updateNoteById = (noteId, noteData) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) return toast.error("Not authenticated");

    try {
      dispatch(setLoading(true));

      const response = await apiConnector(
        "PUT",
        notesEndpoints.UPDATE_NOTE_API(noteId),
        noteData,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) throw new Error(response.data.message);

      dispatch(updateNote(response.data.note));
      toast.success("Note updated successfully!");
    } catch (error) {
      console.error("Update note error:", error);
      toast.error(error.message || "Failed to update note");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * Delete a note by ID
 * @param {string} noteId
 */
export const deleteNoteById = (noteId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) return toast.error("Not authenticated");

    try {
      dispatch(setLoading(true));

      const response = await apiConnector(
        "DELETE",
        notesEndpoints.DELETE_NOTE_API(noteId),
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) throw new Error(response.data.message);

      dispatch(deleteNote(noteId));
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Delete note error:", error);
      toast.error(error.message || "Failed to delete note");
    } finally {
      dispatch(setLoading(false));
    }
  };
};
