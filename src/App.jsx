import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import MyProfile from './pages/MyProfile';
import Requests from './pages/Requests';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b090e] text-gray-100 helios-glow-bg flex flex-col md:flex-row">
        {/* Navigation Sidebar & Header */}
        <Sidebar />

        {/* Main Content Viewport */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen transition-all duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/requests" element={<Requests />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
