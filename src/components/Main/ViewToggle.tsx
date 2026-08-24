import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../app/store";
import { setConfigurationField } from "../../features/configuration/configurationSlice";
import { selectActiveItem } from "../../features/sidebar/sidebarSlice";

/**
 * Exterior / interior segmented toggle, floating top-right over the preview.
 * (Spolja | Unutra) — flips `configuration.interiorDoorShown`.
 * Hidden on the "insert-the-door" (Umetnite vrata) page — there the door is placed into a custom
 * house photo, which has no interior view.
 */
const ViewToggle: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const interior = useSelector((s: RootState) => s.configuration.interiorDoorShown);
  const activeItem = useSelector(selectActiveItem);

  if (activeItem === "insert-the-door") return null;

  const set = (value: boolean) =>
    dispatch(setConfigurationField({ field: "interiorDoorShown", value }));

  const seg =
    "px-7 py-2.5 text-sm font-medium text-white transition-colors focus:outline-none";

  return (
    <div className="absolute right-5 top-5 z-30 flex items-stretch overflow-hidden rounded-xl bg-[#2a2a2ae6] shadow-lg shadow-black/30 backdrop-blur-md">
      <button
        type="button"
        onClick={() => set(false)}
        className={`${seg} ${!interior ? "bg-black" : "hover:bg-white/5"}`}
      >
        {t("view-exterior")}
      </button>
      <span className="my-2 w-px shrink-0 self-stretch bg-white/20" />
      <button
        type="button"
        onClick={() => set(true)}
        className={`${seg} ${interior ? "bg-black" : "hover:bg-white/5"}`}
      >
        {t("view-interior")}
      </button>
    </div>
  );
};

export default ViewToggle;
