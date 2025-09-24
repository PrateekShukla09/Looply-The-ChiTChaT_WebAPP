

// import React from "react";
// import { AuthProvider } from "./hooks/useAuth";
// import MainApp from "./components/MainApp";
// import "./styles/globals.css";
// import "./styles/components.css";

// function App() {
//   return (
//     <AuthProvider>
//       <div className="App">
//         <MainApp />
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;

import React from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import MainApp from "./components/MainApp";
import PhoneSignIn from "./components/PhoneSignIn";
import "./styles/globals.css";
import "./styles/components.css";

// Component that decides what to show based on auth state
function AppContent() {
  const { user, loading } = useAuth(); // assume your useAuth hook exposes user

  if (loading) {
    return <div className="loading">Loading...</div>; // simple fallback
  }

  if (!user) {
    // not logged in → show PhoneSignIn
    return <PhoneSignIn />;
  }

  // logged in → show chat app
  return <MainApp />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;

