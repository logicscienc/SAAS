import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slug: null,
  plan: "Free",
  noteLimit: 3,
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant(state, action) {
      state.slug = action.payload.slug;
      state.plan = action.payload.plan;
      state.noteLimit = action.payload.noteLimit;
    },
    upgradeTenant(state) {
      state.plan = "Pro";
      state.noteLimit = Infinity;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setTenant, upgradeTenant, setLoading, setError } = tenantSlice.actions;
export default tenantSlice.reducer;
