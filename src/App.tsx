import { useEffect } from "react";
import { Home } from "./pages/home/home";
import axios from "axios";
// import "./App.css";

function App() {
  //remove this after buying server
  useEffect(() => {
    axios.get("https://e-com-backend-1zsb.onrender.com");
  });
  return (
    <>
      <Home />
    </>
  );
}

export default App;
