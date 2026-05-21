// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/index.tsx";
import { persistor, store } from "./store/store.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ErrorBoundary } from "react-error-boundary";
import { MainErrorFallback } from "./components/error/main.tsx";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/theme/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ErrorBoundary
    FallbackComponent={MainErrorFallback}
  >
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <Router />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </ErrorBoundary>,

  //  </StrictMode>,
);
