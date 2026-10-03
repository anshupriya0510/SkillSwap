import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import UserProfile from './pages/UserProfile';
import MyProfile from './pages/MyProfile';
import Requests from './pages/Requests';
import ExchangeModal from './components/ExchangeModal';

import { initialUsers, currentUser as defaultCurrentUser } from './data/users';
import { initialRequests } from './data/requests';

function App() {
  // Persistent state management using localStorage + React useState
  const [users] = useState(() => {
    const saved = localStorage.getItem('skillswap_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('skillswap_current_user');
    return saved ? JSON.parse(saved) : defaultCurrentUser;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('skillswap_requests');
    return saved ? JSON.parse(saved) : initialRequests;
  });

  // Exchange Modal State
  const [modalTargetUser, setModalTargetUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync persistent changes to localStorage
  useEffect(() => {
    localStorage.setItem('skillswap_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skillswap_requests', JSON.stringify(requests));
  }, [requests]);

  // Open exchange modal for target user
  const handleOpenExchangeModal = (targetUser) => {
    setModalTargetUser(targetUser);
    setIsModalOpen(true);
  };

  // Add new exchange request
  const handleSendRequest = (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  // Update status (Accepted/Rejected) of a request
  const handleUpdateRequestStatus = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
    );
  };

  // Save updated current user profile
  const handleSaveProfile = (updatedProfile) => {
    setCurrentUser(updatedProfile);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0b090e] text-gray-100 helios-glow-bg flex flex-col md:flex-row font-sans selection:bg-purple-500 selection:text-white">
        {/* Navigation Sidebar */}
        <Sidebar currentUser={currentUser} />

        {/* Viewport Router Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen transition-all duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/discover"
              element={<Discover users={users} onRequestExchange={handleOpenExchangeModal} />}
            />
            <Route
              path="/profile/:id"
              element={<UserProfile users={users} onRequestExchange={handleOpenExchangeModal} />}
            />
            <Route
              path="/my-profile"
              element={<MyProfile currentUser={currentUser} onSaveProfile={handleSaveProfile} />}
            />
            <Route
              path="/requests"
              element={
                <Requests
                  requests={requests}
                  onUpdateRequestStatus={handleUpdateRequestStatus}
                />
              }
            />
          </Routes>
        </main>

        {/* Global Skill Exchange Modal */}
        <ExchangeModal
          targetUser={modalTargetUser}
          currentUser={currentUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSendRequest={handleSendRequest}
        />
      </div>
    </Router>
  );
}

export default App;
