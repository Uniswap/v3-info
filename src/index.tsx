import "inter-ui";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./pages/App";
import store from "./state";
import UserUpdater from "./state/user/updater";
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from "./theme";

window.addEventListener("error", (error) => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true,
  });
});

function Updaters() {
  return (
    <>
      <UserUpdater />
    </>
  );
}

ReactDOM.render(
  <StrictMode>
    <FixedGlobalStyle />
    <Provider store={store}>
      <Updaters />
      <ThemeProvider>
        <ThemedGlobalStyle />
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
  document.getElementById("root")
);
