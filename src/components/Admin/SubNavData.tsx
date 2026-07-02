import React, { ReactNode } from "react";
import AdminSystems from "./AdminSystems";
import AdminColors from "./AdminColors";
import AdminGlasses from "./AdminGlasses";
import AdminDoorTypes from "./AdminDoorTypes";
import AdminLocks from "./AdminLocks";
import AdminOtherEquipment from "./AdminComponents/AdminOtherEquipment";

const subNavData: { name: string; component: ReactNode; disabled: boolean }[] =
  [
    { name: "Sistemi", component: <AdminSystems />, disabled: false },
    { name: "Boje", component: <AdminColors />, disabled: false },
    { name: "Stakla", component: <AdminGlasses />, disabled: false },
    { name: "Modeli vrata", component: <AdminDoorTypes />, disabled: false },
    { name: "Brave", component: <AdminLocks />, disabled: false },
    { name: "Oprema", component: <AdminOtherEquipment />, disabled: false },
  ];

export default subNavData;
