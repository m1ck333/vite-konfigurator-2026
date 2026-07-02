import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Color } from "../../../types";
import useOutsideClick from "../../../hooks/useOutsideClick";

interface ColorSelectProps {
  label: string;
  colors: Color[];
  value: number | null;
  onChange: (value: number) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = ({
  label,
  colors,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClick(wrapperRef, () => setOpen(false));

  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8080";
  const normalizedApiUrl = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;

  const filteredColors = colors.filter(
    (color) => color.is_shown && color.color_category.show_in_stock
  );
  const selectedColor = filteredColors.find((color) => color.id === value);

  const swatchStyle = (color: Color): React.CSSProperties => ({
    backgroundColor: color.color_hex || "transparent",
    backgroundImage: color.thumbnail
      ? `url(${normalizedApiUrl}${encodeURIComponent(color.thumbnail)})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  });

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block mb-1.5 text-sm font-medium text-primary-grey-dark">
        {label} <span className="text-danger">*</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-white border border-primary-grey-lightest rounded-lg px-3 py-2.5 text-sm text-primary-grey-dark outline-none transition-colors hover:border-primary-green-light focus:border-primary-green focus:ring-2 focus:ring-inset focus:ring-primary-green/30"
      >
        {selectedColor ? (
          <span className="flex items-center gap-2 truncate">
            <span
              className="w-6 h-6 rounded-md border border-primary-grey-lightest shrink-0"
              style={swatchStyle(selectedColor)}
            />
            <span className="truncate">{selectedColor.color_code}</span>
          </span>
        ) : (
          <span className="text-primary-grey">-- Izaberite boju --</span>
        )}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-primary-green transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="glass-modal absolute z-50 left-0 right-0 top-full mt-1.5 max-h-60 overflow-y-auto no-scrollbar rounded-xl py-1 animate-fade-in-up">
          {filteredColors.map((color) => {
            const isSel = color.id === value;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => {
                  onChange(color.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  isSel
                    ? "bg-primary-green/10 text-primary-green-dark font-medium"
                    : "text-primary-grey-dark hover:bg-primary-light"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className="w-6 h-6 rounded-md border border-primary-grey-lightest shrink-0"
                    style={swatchStyle(color)}
                  />
                  <span className="truncate">{color.color_code}</span>
                </span>
                {isSel && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-primary-green text-xs shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ColorSelect;
