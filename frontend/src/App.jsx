import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ReportItem from "./pages/ReportItem";
import MyReports from "./pages/MyReports";
import BrowseItems from "./pages/BrowseItems";
import ItemsDetails from "./pages/ItemsDetails";

import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportItem />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/browse" element={<BrowseItems />} />
        <Route path="/item/:id" element={<ItemsDetails />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;