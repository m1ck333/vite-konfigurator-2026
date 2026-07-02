import React, { useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppLayout } from "./layouts/AppLayout";
import { useBackgroundImage } from "./hooks/useBackgroundImage";
import { useAppInitialization } from "./hooks/useAppInitialization";

const App: React.FC = () => {
  const appRef = useRef<HTMLDivElement>(null);
  const { backgroundImage } = useBackgroundImage();
  const { initialize } = useAppInitialization();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} />
      <AppLayout appRef={appRef} backgroundImage={backgroundImage} />
    </>
  );
};

export default App;
