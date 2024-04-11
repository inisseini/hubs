import React from "react";
import { createRoot } from "react-dom/client";
import { WrappedIntlProvider } from "./react-components/wrapped-intl-provider";
import registerTelemetry from "./telemetry";
import "./utils/theme";
import { HomePage } from "./react-components/home/HomePage";
import { AuthContextProvider } from "./react-components/auth/AuthContext";
import "./react-components/styles/global.scss";
import { ThemeProvider } from "./react-components/styles/theme";
import { store } from "./utils/store-instance";

registerTelemetry("/home", "Hubs Home Page");

window.APP = { store };

function HomeRoot() {
  return (
    <WrappedIntlProvider>
      <ThemeProvider store={store}>
        <AuthContextProvider store={store}>
          <HomePage />
        </AuthContextProvider>
      </ThemeProvider>
    </WrappedIntlProvider>
  );
}

function NonBusinessHoursRoot() {
  return <p>運用時間外です。</p>;
}

const container = document.getElementById("home-root");
const root = createRoot(container);

const hour = new Date().getHours();
if (hour >= 8 && hour < 24) {
  root.render(<HomeRoot />);
} else if (0 < hour < 8) {
  //root.render(<NonBusinessHoursRoot />);
  root.render(<HomeRoot />);
}
