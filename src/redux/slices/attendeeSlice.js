import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getAllAttendees} from "../../api/getAttendees";

export const getAttendeeList = createAsyncThunk(
    "/attendees",
    async ( thunkAPI) => {
      try {
        return await getAllAttendees();
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

const initialState = {
  attendeeList:[],
  errorMsg:""
};

const allAttendees = createSlice({
  name: "allAttendeesSlice",
  initialState,
  reducers: {
    resetAttendeesList: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getAttendeeList.fulfilled, (state, { payload }) => {
      state.attendeeList = payload;
      state.errorMsg = ""
    });
    builder.addCase(getAttendeeList.rejected, (state, action) => {
      state.attendeeList = [];
      state.errorMsg = "failed to load attendees"
    });
  },
});

export const { resetAttendeesList } = allAttendees.actions;

export default allAttendees.reducer;