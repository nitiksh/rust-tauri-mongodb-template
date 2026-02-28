import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inbox from "./pages/Inbox";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Delete from "./pages/Delete";
import Success from "./pages/Success";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inbox />} />
          <Route path="create" element={<Create />} />
          <Route path="update/:id" element={<Update />} />
          <Route path="delete" element={<Delete />} />
          <Route path="success" element={<Success />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
