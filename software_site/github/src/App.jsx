import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Github from "./Github"; // ta page principale (GitHubRepoClone renommé ?)
import PDFReaderMain from "./PDF-Reader-Main"; // la page qui affiche Main.jsx

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Github />} />
          <Route path="/server.js" element={<PDFReaderMain />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
