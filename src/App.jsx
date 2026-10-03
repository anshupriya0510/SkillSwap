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
  // State initialization with local memory fallback
  const [users, setUsers] = useState(() => {
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

  // Modal State
  const [modalTargetUser, setModalTargetUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // MERN Backend Data Fetching via Express API
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const fetchedUsers = await usersRes.json();
          if (fetchedUsers.length > 0) setUsers(fetchedUsers);
        }

        const meRes = await fetch('/api/users/me');
        if (meRes.ok) {
          const fetchedMe = await meRes.json();
          if (fetchedMe) setCurrentUser(fetchedMe);
        }

        const reqRes = await fetch('/api/requests');
        if (reqRes.ok) {
          const fetchedReqs = await reqRes.json();
          if (fetchedReqs.length > 0) setRequests(fetchedReqs);
        }
      } catch (err) {
        console.info('Running with client state / localStorage synchronization.');
      }
    };

    fetchBackendData();
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('skillswap_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('skillswap_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skillswap_requests', JSON.stringify(requests));
  }, [requests]);

  const handleOpenExchangeModal = (targetUser) => {
    setModalTargetUser(targetUser);
    setIsModalOpen(true);
  };

  // Add new exchange request (MERN API + Local State)
  const handleSendRequest = async (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);

    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });
    } catch (err) {
      console.warn('Backend API request saved to local state fallback');
    }
  };

  // Update request status using specific action endpoints (accept / reject / cancel)
  // actionType: 'accept' | 'reject' | 'cancel'
  const handleUpdateRequestStatus = async (requestId, actionType) => {
    // Map action string to the display status for immediate local state update
    const statusMap = { accept: 'Accepted', reject: 'Rejected', cancel: 'Cancelled' };
    const newStatus = statusMap[actionType];

    // Optimistic update — update UI immediately before server confirms
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
    );

    try {
      const res = await fetch(`/api/requests/${requestId}/${actionType}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const err = await res.json();
        console.warn('Server rejected action:', err.message);
        // Roll back optimistic update if server rejected it
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? { ...req, status: 'Pending' } : req))
        );
      }
    } catch (err) {
      console.warn('Backend API update saved to local state fallback');
    }
  };

  // Save updated current user profile (MERN API + Local State)
  const handleSaveProfile = async (updatedProfile) => {
    setCurrentUser(updatedProfile);

    try {
      await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
    } catch (err) {
      console.warn('Backend API profile update saved to local state fallback');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0b090e] text-gray-100 helios-glow-bg flex flex-col md:flex-row font-sans selection:bg-purple-500 selection:text-white">
        {/* Navigation Sidebar */}
        <Sidebar currentUser={currentUser} />

        {/* Main Content Area */}
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
