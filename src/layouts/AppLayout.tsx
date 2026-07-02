import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import { SidebarControls } from "../components/Sidebar/SidebarControls";
import FloatingControls from "../components/FloatingControls";

interface AppLayoutProps {
  appRef: React.RefObject<HTMLDivElement>;
  backgroundImage: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  appRef,
  backgroundImage,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      ref={appRef}
      id="app-content"
      className="relative flex h-screen bg-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      }}
    >
      <FloatingControls isSidebarOpen={isSidebarOpen} />

      <SidebarControls
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      >
        <Sidebar
          hideSidebar={() => setIsSidebarOpen(false)}
          isSidebarOpen={isSidebarOpen}
        />
      </SidebarControls>
      <Main
        isSidebarOpen={isSidebarOpen}
        hideSidebar={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};
