import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Read from "./component/Read";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Read />} />
      </Routes>
    </Router>
  );
}

export default App;
