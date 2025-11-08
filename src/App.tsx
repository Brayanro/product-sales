import Navbar from './components/Navbar';
import Table from './components/Tablet';

function App() {
  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Table />
        </main>
      </div>
  );
}

export default App;
