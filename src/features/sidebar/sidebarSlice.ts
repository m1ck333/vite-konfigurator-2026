import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { activeSidebarItem } from "../../types";

type ActiveDropDownActionPayload = {
  field: keyof SidebarState["activeDropDownItem"];
  value: string;
};

interface SidebarState {
  activeItem: activeSidebarItem;
  visitedItems: activeSidebarItem[];
  activeDropDownItem: {
    color: "panel" | "frame";
    model: "all" | "with-glass" | "without-glass";
    glass: "sideglasses" | "skylight" | "doorglass";
    equipment:
      | "handrail"
      | "doorknobOutside"
      | "doorknobInside"
      | "cylinder"
      | "rosette"
      | "parapetProtection"
      | "accessControl"
      | "spy"
      | "hinges"
      | "electromagneticReceiver"
      | "automaticClosingDevice"
      | "houseNumbers";
  };
}

const initialState: SidebarState = {
  activeItem: "type",
  visitedItems: ["type"],
  activeDropDownItem: {
    color: "panel",
    model: "all",
    glass: "sideglasses",
    equipment: "handrail",
  },
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setActiveItem: (state, action: PayloadAction<activeSidebarItem>) => {
      state.activeItem = action.payload;
      if (!state.visitedItems.includes(action.payload)) {
        state.visitedItems.push(action.payload);
      }
    },

    setActiveDropDownItem: (
      state,
      action: PayloadAction<ActiveDropDownActionPayload>
    ) => {
      const { field, value } = action.payload;

      switch (field) {
        case "model":
          state.activeDropDownItem.model =
            value as SidebarState["activeDropDownItem"]["model"];
          break;
        case "glass":
          state.activeDropDownItem.glass =
            value as SidebarState["activeDropDownItem"]["glass"];
          break;
        case "equipment":
          state.activeDropDownItem.equipment =
            value as SidebarState["activeDropDownItem"]["equipment"];
          break;

        case "color":
          state.activeDropDownItem.color =
            value as SidebarState["activeDropDownItem"]["color"];
          break;
        default:
          console.error(`Invalid field: ${field}`);
      }
    },

    resetActiveDropDownItemGlass: (state) => {
      state.activeDropDownItem.glass = initialState.activeDropDownItem.glass;
    },
  },
});

export const {
  setActiveItem,
  setActiveDropDownItem,
  resetActiveDropDownItemGlass,
} = sidebarSlice.actions;

export const selectActiveItem = (state: {
  sidebar: SidebarState;
}): activeSidebarItem => state.sidebar.activeItem;

export const selectVisitedItems = (state: {
  sidebar: SidebarState;
}): activeSidebarItem[] => state.sidebar.visitedItems;

export default sidebarSlice.reducer;
