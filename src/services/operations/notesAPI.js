import { apiConnector } from "../apiConnector";
import { notesEndpoints } from "../apis";
import { setNotes, addNote, updateNote, deleteNote, setLoading } from "../../slices/notesSlice";
import { toast } from "react-hot-toast";
import { setTenant } from "../../slices/tenantSlice";
import { tenantEndpoints } from "../apis";

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

      dispatch(setNotes(response.data.notes || []));

      if (response.data.tenant) {
        const tenantData = response.data.tenant;
        dispatch(setTenant({
          slug: tenantData.slug,
          plan: tenantData.plan,
          noteLimit: tenantData.plan.toLowerCase() === "free" ? 3 : Infinity,
        }));
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

      dispatch(addNote(response.data.data)); // <-- corrected
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

      dispatch(updateNote(response.data.data)); // <-- corrected
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

      dispatch(deleteNote(noteId)); // <-- dispatch only the id
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Delete note error:", error);
      toast.error(error.message || "Failed to delete note");
    } finally {
      dispatch(setLoading(false));
    }
  };
};


/**
 * Upgrade Tenant Plan (Free -> Pro)
 */
export const upgradeTenant = (slug) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) return toast.error("Not authenticated");

    try {
      dispatch(setLoading(true));

      const response = await apiConnector(
        "POST",
        tenantEndpoints.UPGRADE_TENANT_API(slug),
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) throw new Error(response.data.message);

      const updatedTenant = response.data.data;
      dispatch(setTenant({
        slug: updatedTenant.slug,
        plan: updatedTenant.plan,
        noteLimit: updatedTenant.plan.toLowerCase() === "free" ? 3 : Infinity,
      }));

      toast.success("Tenant upgraded successfully!");
    } catch (error) {
      console.error("Upgrade tenant error:", error);
      toast.error(error.message || "Failed to upgrade tenant");
    } finally {
      dispatch(setLoading(false));
    }
  };
};


/**
 * Fetch tenant info
 */
export const getTenant = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) return Promise.resolve(null);

    try {
      const response = await apiConnector(
        "GET",
        tenantEndpoints.GET_TENANT_DETAILS_API,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success && response.data.data) {
        const tenantData = response.data.data;
        dispatch(setTenant({
          slug: tenantData.slug,
          plan: tenantData.plan,
          noteLimit: tenantData.plan.toLowerCase() === "free" ? 3 : Infinity,
        }));
        return tenantData;
      }
    } catch (error) {
      console.error("Fetch tenant error:", error);
      toast.error("Failed to fetch tenant info");
    }

    return null;
  };
};



