import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
    </Routes>
  );
}

export default App;