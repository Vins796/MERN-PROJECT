import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SinglePost from "./pages/SinglePost";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Flowbite } from "flowbite-react";

export default function App() {

  return (
    <Flowbite>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/create" element={<CreatePost />}></Route>
          <Route path="/post/:id" element={<SinglePost />}></Route>
        </Routes>
        <Footer />
      </Router>
    </Flowbite>
  )
}
