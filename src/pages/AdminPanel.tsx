import React, { useState, ReactNode } from "react";
import subNavData from "../components/Admin/SubNavData";
import AdminSystems from "../components/Admin/AdminSystems";

const AdminPanel: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ReactNode>(
    <AdminSystems />
  );
  const [activeId, setActiveId] = useState<number>(0);

  const handleButtonClick = (component: ReactNode, id: number) => {
    setActiveComponent(component);
    setActiveId(id);
  };

  return (
    <>
      <nav className="flex flex-wrap gap-1 bg-[#0d0d0d] px-4">
        {subNavData.map((item, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(item.component, index)}
            disabled={item.disabled}
            className={`relative px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
              activeId === index
                ? "text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            {item.name}
            {activeId === index && (
              <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-primary-green" />
            )}
          </button>
        ))}
      </nav>

      <div className="mx-auto w-full max-w-5xl p-4 md:p-6">{activeComponent}</div>
    </>
  );
};

export default AdminPanel;
