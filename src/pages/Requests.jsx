import { useState } from 'react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';

function Requests({ requests, onUpdateRequestStatus }) {
  const [activeTab, setActiveTab] = useState('received');

  const receivedRequests = requests.filter((r) => r.direction === 'received');
  const sentRequests = requests.filter((r) => r.direction === 'sent');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 px-2">
      {/* Header Banner */}
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
          onClick={() => setActiveTab('received')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'received'
              ? 'mauve-gradient-btn text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Received Requests ({receivedRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'sent'
              ? 'mauve-gradient-btn text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Sent Requests ({sentRequests.length})
        </button>
      </div>

      {/* Received Requests Tab Content */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length > 0 ? (
            receivedRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-purple-400/30 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <Avatar src={req.fromUser.avatar} name={req.fromUser.name} size="md" />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-white">{req.fromUser.name}</h3>
                      {getStatusBadge(req.status)}
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5">
                      "{req.message}"
                    </p>

                    {/* Skill Pair Summary */}
                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                      <span className="text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Teaches: {req.theirSkillToTeach}
                      </span>
                      <span className="text-gray-400">⇄</span>
                      <span className="text-purple-300 font-medium bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                        Wants: {req.mySkillToTeach}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accept / Reject Action Buttons */}
                {req.status === 'Pending' ? (
                  <div className="flex items-center space-x-3 shrink-0 pt-2 md:pt-0">
                    <Button
                      variant="secondary"
                      onClick={() => onUpdateRequestStatus(req.id, 'Rejected')}
                      className="px-4 py-2 text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => onUpdateRequestStatus(req.id, 'Accepted')}
                      className="px-4 py-2 text-xs"
                    >
                      Accept Request
                    </Button>
                  </div>
                ) : (
                  <div className="shrink-0 text-xs text-gray-400">
                    Action recorded as <strong className="text-white">{req.status}</strong>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center space-y-3 backdrop-blur-xl">
              <p className="text-gray-400 text-sm">No received exchange requests yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Sent Requests Tab Content */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-purple-400/30 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <Avatar src={req.toUser.avatar} name={req.toUser.name} size="md" />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-white">To: {req.toUser.name}</h3>
                      {getStatusBadge(req.status)}
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5">
                      "{req.message}"
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                      <span className="text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        You Teach: {req.mySkillToTeach}
                      </span>
                      <span className="text-gray-400">⇄</span>
                      <span className="text-purple-300 font-medium bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                        You Learn: {req.theirSkillToTeach}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-xs text-gray-400">
                  Sent on {req.createdAt}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center space-y-3 backdrop-blur-xl">
              <p className="text-gray-400 text-sm">You haven't sent any exchange requests yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Requests;
