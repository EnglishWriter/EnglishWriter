import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import EnglishWriter from "./components/EnglishWriter";
// في App.jsx الخاص فيك
function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<EnglishWriter />} />
    </Routes>
  );
}

export default App;
