import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",

  initialState: {
    applicants: [],
  },

  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    updateApplicantStatus: (state, action) => {
      const { id, status } = action.payload;
      if (state.applicants?.applications) {
        const applicant = state.applicants.applications.find(
          (item) => item._id === id
        );
        if (applicant) {
          applicant.status = status.toLowerCase();
        }
      }
    },
  },
});

export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;

export default applicationSlice.reducer;