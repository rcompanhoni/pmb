import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
      </Routes>
    </Router>
  );
}
