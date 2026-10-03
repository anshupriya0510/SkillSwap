import { useState } from 'react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';

// Action-type strings sent to App.jsx → API
// 'accept'  → PATCH /api/requests/:id/accept  (receiver only)
// 'reject'  → PATCH /api/requests/:id/reject  (receiver only)
// 'cancel'  → PATCH /api/requests/:id/cancel  (sender only)

function Requests({ requests, onUpdateRequestStatus }) {
  const [activeTab, setActiveTab] = useState('received');
  // Track which request id is currently loading (prevents double-clicks)
  const [loadingId, setLoadingId] = useState(null);

  const receivedRequests = requests.filter((r) => r.direction === 'received');
  const sentRequests = requests.filter((r) => r.direction === 'sent');

  // ── Perform an action with loading state guard ──────────────────────────
  const handleAction = async (requestId, actionType) => {
    setLoadingId(`${requestId}-${actionType}`);
    await onUpdateRequestStatus(requestId, actionType);
    setLoadingId(null);
  };

  const isLoading = (requestId, actionType) => loadingId === `${requestId}-${actionType}`;

  // ── Status badge component ───────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const styles = {
      Accepted:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      Rejected:  'bg-rose-500/20 text-rose-300 border-rose-500/30',
      Cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      Scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      Completed: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      Pending:   'bg-amber-500/20 text-amber-300 border-amber-500/30',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status] ?? styles.Pending}`}>
        {status}
      </span>
    );
  };

  // ── Request card layout (shared) ─────────────────────────────────────────
  const RequestCard = ({ req, actions }) => (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-purple-400/30 transition-all">
      <div className="flex items-start space-x-4">
        {/* Avatar for received = sender, for sent = recipient */}
        <Avatar
          src={req.direction === 'received' ? req.fromUser?.avatar : req.toUser?.avatar}
          name={req.direction === 'received' ? req.fromUser?.name : req.toUser?.name}
          size="md"
        />
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-white">
              {req.direction === 'received'
                ? req.fromUser?.name
                : `To: ${req.toUser?.name}`}
            </h3>
            {getStatusBadge(req.status)}
          </div>

          {req.message && (
            <p className="text-xs text-gray-300 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5">
              &ldquo;{req.message}&rdquo;
            </p>
          )}

          {/* Skill pair pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
            <span className="text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {req.direction === 'received' ? 'Teaches' : 'You Teach'}: {req.direction === 'received' ? req.theirSkillToTeach : req.mySkillToTeach}
            </span>
            <span className="text-gray-400">⇄</span>
            <span className="text-purple-300 font-medium bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              {req.direction === 'received' ? 'Wants' : 'You Learn'}: {req.direction === 'received' ? req.mySkillToTeach : req.theirSkillToTeach}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            {req.direction === 'received' ? 'Received' : 'Sent'} on {req.createdAt || 'recently'}
          </p>
        </div>
      </div>

      {/* Action buttons or final state message */}
      <div className="shrink-0">
        {actions}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 px-2">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-300">
          <span>Skill Exchange Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">Requests</span>
        </h1>
        <p className="text-gray-300 text-sm max-w-xl">
          Review incoming exchange invitations and monitor the status of requests you sent.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        <button
          id="tab-received"
          onClick={() => setActiveTab('received')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'received'
              ? 'mauve-gradient-btn text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          id="tab-sent"
          onClick={() => setActiveTab('sent')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'sent'
              ? 'mauve-gradient-btn text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {/* ── RECEIVED TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length > 0 ? (
            receivedRequests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                actions={
                  req.status === 'Pending' ? (
                    <div className="flex items-center space-x-3">
                      <Button
                        id={`reject-${req.id}`}
                        variant="secondary"
                        onClick={() => handleAction(req.id, 'reject')}
                        disabled={loadingId !== null}
                        className="px-4 py-2 text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
                      >
                        {isLoading(req.id, 'reject') ? 'Rejecting…' : 'Reject'}
                      </Button>
                      <Button
                        id={`accept-${req.id}`}
                        variant="primary"
                        onClick={() => handleAction(req.id, 'accept')}
                        disabled={loadingId !== null}
                        className="px-4 py-2 text-xs disabled:opacity-50"
                      >
                        {isLoading(req.id, 'accept') ? 'Accepting…' : 'Accept Request'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">
                      Action recorded as <strong className="text-white">{req.status}</strong>
                    </div>
                  )
                }
              />
            ))
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
              <p className="text-gray-400 text-sm">No received exchange requests yet.</p>
            </div>
          )}
        </div>
      )}

      {/* ── SENT TAB ────────────────────────────────────────────────────── */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                actions={
                  req.status === 'Pending' ? (
                    // Sender can cancel a pending request
                    <Button
                      id={`cancel-${req.id}`}
                      variant="secondary"
                      onClick={() => handleAction(req.id, 'cancel')}
                      disabled={loadingId !== null}
                      className="px-4 py-2 text-xs border-gray-500/30 text-gray-400 hover:bg-gray-500/10 hover:text-white disabled:opacity-50"
                    >
                      {isLoading(req.id, 'cancel') ? 'Cancelling…' : 'Cancel Request'}
                    </Button>
                  ) : (
                    <div className="text-xs text-gray-400">
                      Status: <strong className="text-white">{req.status}</strong>
                    </div>
                  )
                }
              />
            ))
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
              <p className="text-gray-400 text-sm">You haven&apos;t sent any exchange requests yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Requests;
