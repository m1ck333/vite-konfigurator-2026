import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BackgroundState {
  houseImageUrl: string;
  colorImageUrl: string;
  selectedColorId: number | null;
  selectedHouseId: number | null;
}

const initialState: BackgroundState = {
  houseImageUrl: "",
  colorImageUrl: "",
  selectedColorId: 5,
  selectedHouseId: 1,
};

export const backgroundSlice = createSlice({
  name: "background",
  initialState,
  reducers: {
    setHouseImageUrl: (state, action: PayloadAction<string>) => {
      state.houseImageUrl = action.payload;
    },
    setColorImageUrl: (state, action: PayloadAction<string>) => {
      state.colorImageUrl = action.payload;
    },
    setSelectedColorId: (state, action: PayloadAction<number | null>) => {
      state.selectedColorId = action.payload;
    },
    setSelectedHouseId: (state, action: PayloadAction<number | null>) => {
      state.selectedHouseId = action.payload;
    },
  },
});

export const {
  setHouseImageUrl,
  setColorImageUrl,
  setSelectedColorId,
  setSelectedHouseId,
} = backgroundSlice.actions;

export default backgroundSlice.reducer;
