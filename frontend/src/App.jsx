

import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import MainApp from "./components/MainApp";
import "./styles/globals.css";
import "./styles/components.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <MainApp />
      </div>
    </AuthProvider>
  );
}

export default App;

