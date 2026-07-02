import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PriceDetail {
  priceWithoutVat: number;
  priceWithVat: number;
}

export interface PriceState {
  modelPrice: PriceDetail | null;
  systemPrice: PriceDetail | null;
  colorPrice: PriceDetail | null;
  lockPrice: PriceDetail | null;
  equipmentPrices: PriceDetail | null;
  glassPrices: PriceDetail | null;
  totalPrice: PriceDetail | null;
  markup: number | null;
  discount: number | null;
  vat: number | null;
}

const initialState: PriceState = {
  modelPrice: null,
  systemPrice: null,
  colorPrice: null,
  lockPrice: null,
  equipmentPrices: null,
  glassPrices: null,
  totalPrice: null,
  markup: null,
  discount: null,
  vat: null,
};

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    setPriceDetails: (state, action: PayloadAction<PriceState>) => {
      state.modelPrice = action.payload.modelPrice;
      state.systemPrice = action.payload.systemPrice;
      state.colorPrice = action.payload.colorPrice;
      state.lockPrice = action.payload.lockPrice;
      state.equipmentPrices = action.payload.equipmentPrices;
      state.glassPrices = action.payload.glassPrices;
      state.totalPrice = action.payload.totalPrice;
      state.markup = action.payload.markup;
      state.discount = action.payload.discount;
      state.vat = action.payload.vat;
    },
  },
});

export const { setPriceDetails } = priceSlice.actions;
export default priceSlice.reducer;
