import React from "react";

interface Tab {
  label: string;
  value: string;
}

interface TabSwitcherProps<T extends string> {
  activeTab: T;
  tabs: Tab[];
  onTabChange: (value: T) => void;
}

/** Modern segmented control. */
const TabSwitcher = <T extends string>({
  activeTab,
  tabs,
  onTabChange,
}: TabSwitcherProps<T>) => {
  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-primary-grey-lightest bg-primary-light p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value as T)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
              isActive
                ? "bg-primary-green text-white shadow-sm"
                : "text-primary-grey-dark hover:text-primary-green"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitcher;
