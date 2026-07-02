import {
  createSlice,
  createAsyncThunk,
  Draft,
  PayloadAction,
} from "@reduxjs/toolkit";
import { fetchDefaultItemsAPI } from "../../api/configurationAPI";
import { RootState } from "../../app/store";
import {
  Door,
  EquipmentSystem,
  EquipmentGlass,
  EquipmentLock,
  EquipmentOther,
} from "../../types";
import { findItemTranslations, processGlassDefaults } from "../../utils";

interface EquipmentSelection {
  id: number | null;
}

export interface EquipmentSelections {
  handrail: EquipmentSelection;
  doorknobInside: EquipmentSelection;
  rosette: EquipmentSelection;
  parapetProtection: EquipmentSelection;
  accessControl: EquipmentSelection;
  spy: EquipmentSelection;
  hinges: EquipmentSelection;
  electromagneticReceiver: EquipmentSelection;
  automaticClosingDevice: EquipmentSelection;
  houseNumbers: EquipmentSelection;
  cylinder: EquipmentSelection;
  lock: EquipmentSelection;
}

export interface DefaultItemsResponse {
  door: Door[];
  equipment_system: EquipmentSystem[];
  equipment_glass: EquipmentGlass[];
  equipment_lock: EquipmentLock[];
  equipment_other: EquipmentOther[];
}

export interface ConfigurationState {
  totalPrice: number | null;
  interiorDoorShown: boolean;
  "model-name": string | null;
  "model-id": number | null;
  type: string;
  "transom-glass-name": string | null;
  "transom-glass-id": number | null;
  "side-glass-name": string | null;
  "side-glass-id": number | null;
  "inner-glass-name": string | null;
  "inner-glass-id": number | null;
  "is-panel-color-default": boolean;
  "panel-color-name": string | null;
  "frame-color-name": string | null;
  "panel-color-id": number | null;
  "frame-color-id": number | null;
  "system-name": string | null;
  "system-id": number | null;
  equipment: EquipmentSelections;

  // Default values from API
  defaults: {
    "side-glass-name": string | null;
    "side-glass-id": number | null;
    "transom-glass-name": string | null;
    "transom-glass-id": number | null;
    "inner-glass-name": string | null;
    "inner-glass-id": number | null;
  };

  //dimensions
  width: number;
  height: number;
  halfPanelWidth: number;
  leftSideWidth: number;
  rightSideWidth: number;
  upperGlassHeight: number;
  "panel-color": string | null;
  "frame-color": string | null;
  "left-side-glass-number": number;
  "right-side-glass-number": number;
  "DIN-opening-standard": string | null;

  // not needed data for API
  material: string | null;
  dimension: string | null;
  "sash-width": string | null;
  "side-glass-left": string | null;
  "side-glass-right": string | null;
}

export const fetchDefaultItems = createAsyncThunk<
  DefaultItemsResponse,
  void,
  { rejectValue: { message: string; status: number } }
>("configuration/fetchDefaultItems", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchDefaultItemsAPI();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.toJSON ? error.toJSON() : error);
  }
});

export const fetchDefaultGlass = createAsyncThunk<
  EquipmentGlass[],
  void,
  { rejectValue: { message: string; status: number } }
>("configuration/fetchDefaultGlass", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/default-glass`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch default glass");
    }

    return response.json();
  } catch (error: any) {
    return rejectWithValue(error.toJSON ? error.toJSON() : error);
  }
});

const initialState: ConfigurationState = {
  totalPrice: 0,
  interiorDoorShown: false,
  "model-name": null,
  "model-id": null,
  type: "single-leaf-door",
  "transom-glass-name": null,
  "transom-glass-id": null,
  "side-glass-name": null,
  "side-glass-id": null,
  "inner-glass-name": null,
  "inner-glass-id": null,
  "is-panel-color-default": true,
  "panel-color-name": null,
  "frame-color-name": null,
  "panel-color-id": null,
  "frame-color-id": null,
  "system-name": null,
  "system-id": null,
  equipment: {
    handrail: { id: null },
    rosette: { id: null },
    hinges: { id: null },
    doorknobInside: { id: null },
    parapetProtection: { id: null },
    accessControl: { id: null },
    spy: { id: null },
    electromagneticReceiver: {
      id: null,
    },
    automaticClosingDevice: { id: null },
    houseNumbers: { id: null },
    cylinder: { id: null },
    lock: { id: null },
  },
  defaults: {
    "side-glass-name": null,
    "side-glass-id": null,
    "transom-glass-name": null,
    "transom-glass-id": null,
    "inner-glass-name": null,
    "inner-glass-id": null,
  },
  width: 1050,
  height: 2100,
  halfPanelWidth: 1050,
  leftSideWidth: 500,
  rightSideWidth: 500,
  upperGlassHeight: 500,
  "panel-color": null,
  "frame-color": null,
  "left-side-glass-number": 1,
  "right-side-glass-number": 1,
  "DIN-opening-standard": "left-inside",

  // not needed data for API

  material: "aluminium",
  dimension: null,
  "sash-width": null,
  "side-glass-left": null,
  "side-glass-right": null,
};

export const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    setConfigurationField: <T extends keyof ConfigurationState>(
      state: Draft<ConfigurationState>,
      action: PayloadAction<{
        field: T;
        value: ConfigurationState[T];
      }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setEquipmentSelection: (
      state,
      action: PayloadAction<{
        category: keyof EquipmentSelections;
        selection: EquipmentSelection;
      }>
    ) => {
      const { category, selection } = action.payload;
      state.equipment[category] = selection;
    },
    setTotalPrice: (state, action: PayloadAction<number | null>) => {
      state.totalPrice = action.payload;
    },
    resetToDefaultGlass: (state) => {
      // Reset side glass to default values from the utility function
      state["side-glass-name"] = state.defaults["side-glass-name"];
      state["side-glass-id"] = state.defaults["side-glass-id"];

      // Reset transom glass to default values if needed
      state["transom-glass-name"] = state.defaults["transom-glass-name"];
      state["transom-glass-id"] = state.defaults["transom-glass-id"];

      // Reset inner glass to default values if needed
      state["inner-glass-name"] = state.defaults["inner-glass-name"];
      state["inner-glass-id"] = state.defaults["inner-glass-id"];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultItems.fulfilled, (state, action) => {
        if (action.payload) {
          // Handle door data
          if (action.payload.door && action.payload.door.length > 0) {
            const defaultDoor = action.payload.door[0];
            if (defaultDoor.id) {
              state["model-id"] = defaultDoor.id;
            }
            if (defaultDoor.model_code) {
              state["model-name"] = defaultDoor.model_code;
            }

            // Handle color data
            if (defaultDoor.color) {
              if (defaultDoor.color.id) {
                state["panel-color-id"] = defaultDoor.color.id;
                state["frame-color-id"] = defaultDoor.color.id;
              }
              if (defaultDoor.color.color_code) {
                state["panel-color-name"] = defaultDoor.color.color_code;
                state["frame-color-name"] = defaultDoor.color.color_code;
              }
            }

            // Handle side glass logic
            if (defaultDoor.side_glass_code !== null) {
              state["side-glass-id"] = 0;
              state["side-glass-name"] = defaultDoor.side_glass_code;
            } else if (
              action.payload.equipment_glass &&
              action.payload.equipment_glass.length > 0
            ) {
              // Find a side glass type
              const defaultSideGlass =
                action.payload.equipment_glass.find(
                  (glass) => glass.type === "sideglass"
                ) || action.payload.equipment_glass[0];
              if (defaultSideGlass.id) {
                state["side-glass-id"] = defaultSideGlass.id;
              }
              if (
                defaultSideGlass.translations &&
                defaultSideGlass.translations.length > 0
              ) {
                const translation = findItemTranslations(
                  defaultSideGlass.translations
                );
                state["side-glass-name"] = translation.name;
              }
            }

            // Handle inner glass logic - similar to side glass
            if (defaultDoor.has_glass) {
              if (defaultDoor.decorative_glass_name) {
                state["inner-glass-id"] = 0;
                state["inner-glass-name"] = defaultDoor.decorative_glass_name;
              }
              // We'll set inner glass from defaults later if needed
            } else {
              state["inner-glass-name"] = null;
              state["inner-glass-id"] = null;
            }
          }

          // Process glass defaults using utility function
          if (
            action.payload.equipment_glass &&
            action.payload.equipment_glass.length > 0
          ) {
            const glassDefaults = processGlassDefaults(
              action.payload.equipment_glass
            );

            // Set defaults in state
            state.defaults = {
              "side-glass-name": glassDefaults["side-glass-name"],
              "side-glass-id": glassDefaults["side-glass-id"],
              "transom-glass-name": glassDefaults["transom-glass-name"],
              "transom-glass-id": glassDefaults["transom-glass-id"],
              "inner-glass-name": glassDefaults["inner-glass-name"],
              "inner-glass-id": glassDefaults["inner-glass-id"],
            };

            // Set transom glass in state
            state["transom-glass-id"] = glassDefaults["transom-glass-id"];
            state["transom-glass-name"] = glassDefaults["transom-glass-name"];

            // Set inner glass in state if not already set by door model
            if (state["inner-glass-name"] === null) {
              state["inner-glass-id"] = glassDefaults["inner-glass-id"];
              state["inner-glass-name"] = glassDefaults["inner-glass-name"];
            }
          }

          // Handle equipment system data
          if (
            action.payload.equipment_system &&
            action.payload.equipment_system.length > 0
          ) {
            const defaultSystem = action.payload.equipment_system[0];
            if (defaultSystem.id) {
              state["system-id"] = defaultSystem.id;
            }
            if (defaultSystem.name) {
              state["system-name"] = defaultSystem.name;
            }
          }

          // Handle equipment lock data
          if (
            action.payload.equipment_lock &&
            action.payload.equipment_lock.length > 0
          ) {
            const defaultLock = action.payload.equipment_lock[0];

            if (defaultLock.id) {
              state.equipment.lock.id = defaultLock.id;
            }
          }

          // Handle equipment other data
          if (
            action.payload.equipment_other &&
            action.payload.equipment_other.length > 0
          ) {
            // Map category IDs to equipment selection keys
            const categoryMap: Record<number, keyof EquipmentSelections> = {
              1: "handrail",
              2: "doorknobInside",
              3: "rosette",
              4: "parapetProtection",
              5: "accessControl",
              6: "spy",
              7: "cylinder",
              8: "hinges",
              9: "electromagneticReceiver",
              10: "automaticClosingDevice",
              11: "houseNumbers",
            };

            // Process each equipment item based on its category_id
            action.payload.equipment_other.forEach((item) => {
              if (item.category_id) {
                const categoryName = categoryMap[item.category_id];
                if (categoryName && state.equipment[categoryName]) {
                  state.equipment[categoryName].id = item.id;
                }
              }
            });
          }
        }
      })
      .addCase(fetchDefaultGlass.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          // Find a side glass type
          const defaultSideGlass =
            action.payload.find((glass) => glass.type === "sideglass") ||
            action.payload[0];
          if (defaultSideGlass.id) {
            state["side-glass-id"] = defaultSideGlass.id;
          }
          if (
            defaultSideGlass.translations &&
            defaultSideGlass.translations.length > 0
          ) {
            const translation = findItemTranslations(
              defaultSideGlass.translations
            );
            state["side-glass-name"] = translation.name;
          }

          // Find a transom glass type
          const defaultTransomGlass = action.payload.find(
            (glass) => glass.type === "ornament"
          );
          if (defaultTransomGlass) {
            if (defaultTransomGlass.id) {
              state["transom-glass-id"] = defaultTransomGlass.id;
            }
            if (
              defaultTransomGlass.translations &&
              defaultTransomGlass.translations.length > 0
            ) {
              const translation = findItemTranslations(
                defaultTransomGlass.translations
              );
              state["transom-glass-name"] = translation.name;
            }
          }

          // Find an inner glass type
          const defaultInnerGlass =
            action.payload.find((glass) => glass.type === "decorative") ||
            action.payload.find((glass) => glass.type === "ornament") ||
            action.payload[0];

          if (defaultInnerGlass) {
            if (defaultInnerGlass.id) {
              state["inner-glass-id"] = defaultInnerGlass.id;
            }
            if (
              defaultInnerGlass.translations &&
              defaultInnerGlass.translations.length > 0
            ) {
              const translation = findItemTranslations(
                defaultInnerGlass.translations
              );
              state["inner-glass-name"] = translation.name;
            }
          }
        }
      });
  },
});

export const {
  setConfigurationField,
  setEquipmentSelection,
  setTotalPrice,
  resetToDefaultGlass,
} = configurationSlice.actions;

export const selectConfiguration = (state: RootState) => state.configuration;

export default configurationSlice.reducer;
