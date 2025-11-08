import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import { Products } from "./pages/Products";
import { Sales } from "./pages/Sales";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
