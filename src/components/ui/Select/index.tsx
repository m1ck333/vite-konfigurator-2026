import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import useOutsideClick from "../../../hooks/useOutsideClick";

interface SelectOption {
  value: string | null;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  classNames?: string;
  label?: string;
  includeNoneOption?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  classNames,
  label,
  includeNoneOption = false,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useOutsideClick(wrapperRef, () => setOpen(false));

  const allOptions: SelectOption[] = includeNoneOption
    ? [{ value: "", label: `--- ${t("choose")} ---` }, ...options]
    : options;

  const selected = allOptions.find((o) => (o.value ?? "") === (value ?? ""));

  const toggle = () => {
    if (!open) {
      // open upward if there isn't enough room below
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setOpenUp(window.innerHeight - rect.bottom < 240);
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    // Close when an OUTER scroll container moves (so the dropdown doesn't
    // detach from its trigger) — but ignore scrolling inside the list itself.
    const onScroll = (e: Event) => {
      if (wrapperRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open]);

  return (
    <div className={`relative ${classNames ?? ""}`} ref={wrapperRef}>
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-primary-grey-dark">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between gap-2 bg-white border border-primary-grey-lightest rounded-lg px-3 py-2.5 text-sm text-primary-grey-dark outline-none transition-colors hover:border-primary-green-light focus:border-primary-green focus:ring-2 focus:ring-inset focus:ring-primary-green/30"
      >
        <span className="truncate">
          {selected ? selected.label : `--- ${t("choose")} ---`}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-primary-green transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`glass-modal absolute z-50 left-0 right-0 max-h-60 overflow-y-auto no-scrollbar rounded-xl py-1 animate-fade-in-up ${
            openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {allOptions.map((opt) => {
            const isSel = (opt.value ?? "") === (value ?? "");
            return (
              <button
                key={opt.value ?? "none"}
                type="button"
                onClick={() => {
                  onChange(opt.value || null);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  isSel
                    ? "bg-primary-green/10 text-primary-green-dark font-medium"
                    : "text-primary-grey-dark hover:bg-primary-light"
                }`}
              >
                <span className="truncate">{opt.label}</span>
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

export default Select;
