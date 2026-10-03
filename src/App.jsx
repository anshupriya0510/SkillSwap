import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import UserProfile from './pages/UserProfile';
import MyProfile from './pages/MyProfile';
import Requests from './pages/Requests';
import ExchangeModal from './components/ExchangeModal';
import { API_BASE } from './lib/api';

import { initialUsers, currentUser as defaultCurrentUser } from './data/users';
import { initialRequests } from './data/requests';

function App() {
  // ── State ──────────────────────────────────────────────────────────────────
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

  const [modalTargetUser, setModalTargetUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Fetch from backend on mount ────────────────────────────────────────────
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [usersRes, meRes, reqRes] = await Promise.all([
          fetch(`${API_BASE}/users`),
          fetch(`${API_BASE}/users/me`),
          fetch(`${API_BASE}/requests`),
        ]);

        if (usersRes.ok) {
          const data = await usersRes.json();
          if (data.length > 0) setUsers(data);
        }
        if (meRes.ok) {
          const data = await meRes.json();
          if (data) setCurrentUser(data);
        }
        if (reqRes.ok) {
          const data = await reqRes.json();
          if (data.length > 0) setRequests(data);
        }
      } catch {
        console.info('Backend unavailable — using local state.');
      }
    };
    fetchBackendData();
  }, []);

  // ── Sync to localStorage ───────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem('skillswap_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('skillswap_current_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('skillswap_requests', JSON.stringify(requests)); }, [requests]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleOpenExchangeModal = (targetUser) => {
    setModalTargetUser(targetUser);
    setIsModalOpen(true);
  };

  // Create a new skill exchange request
  const handleSendRequest = async (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });
      if (!res.ok) {
        const err = await res.json();
        console.warn('POST /api/requests failed:', err.message);
      }
    } catch {
      console.warn('Backend unavailable — request saved locally.');
    }
  };

  // Unified request action handler.
  // actionType: 'accept' | 'reject' | 'cancel' | 'schedule' | 'complete'
  // extra:      { sessionLink, sessionTime } for 'schedule', unused otherwise
  // Returns false if server rejected the action (so Requests.jsx can show error toast).
  const handleUpdateRequestStatus = async (requestId, actionType, extra = {}) => {
    // Optimistic status map
    const statusMap = {
      accept:   'Accepted',
      reject:   'Rejected',
      cancel:   'Cancelled',
      schedule: 'Scheduled',
      complete: 'Completed',
    };
    const newStatus = statusMap[actionType];

    // Snapshot original request BEFORE optimistic update (for rollback)
    let originalReq = null;
    setRequests((prev) => {
      const found = prev.find((r) => r.id === requestId);
      if (found) originalReq = { ...found };
      return prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: newStatus,
              ...(actionType === 'schedule'
                ? { sessionLink: extra.sessionLink, sessionTime: extra.sessionTime }
                : {}),
            }
          : req
      );
    });

    try {
      const res = await fetch(`${API_BASE}/requests/${requestId}/${actionType}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: actionType === 'schedule' ? JSON.stringify(extra) : undefined,
      });

      if (!res.ok) {
        const err = await res.json();
        console.warn(`Server rejected '${actionType}':`, err.message);
        // Roll back optimistic update — restore exact original state
        if (originalReq) {
          setRequests((prev) =>
            prev.map((req) => (req.id === requestId ? originalReq : req))
          );
        }
        return false; // signal error to Requests.jsx
      }

      // On success, refresh from server to get otherUserContact populated
      const { request: updated } = await res.json();
      if (updated) {
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? { ...req, ...updated } : req))
        );
      }
    } catch {
      console.warn('Backend unavailable — action saved locally.');
    }
  };

  // Save current user profile
  const handleSaveProfile = async (updatedProfile) => {
    setCurrentUser(updatedProfile);
    try {
      await fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
    } catch {
      console.warn('Backend unavailable — profile saved locally.');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0b090e] text-gray-100 helios-glow-bg flex flex-col md:flex-row font-sans selection:bg-purple-500 selection:text-white">
        <Sidebar currentUser={currentUser} />

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
