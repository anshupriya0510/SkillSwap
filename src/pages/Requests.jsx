import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';

// ─── Toast component ──────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-medium animate-fadeIn transition-all ${
        isError
          ? 'bg-rose-900/80 border-rose-500/40 text-rose-200'
          : 'bg-emerald-900/80 border-emerald-500/40 text-emerald-200'
      }`}
    >
      <span>{isError ? '✗' : '✓'}</span>
      <span>{toast.message}</span>
      <button onClick={onDismiss} className="ml-2 text-white/50 hover:text-white text-xs cursor-pointer">✕</button>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    Pending:   { cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30',   icon: '⏳' },
    Accepted:  { cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '✓' },
    Rejected:  { cls: 'bg-rose-500/20 text-rose-300 border-rose-500/30',      icon: '✗' },
    Cancelled: { cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30',      icon: '⊘' },
    Scheduled: { cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30',      icon: '📅' },
    Completed: { cls: 'bg-teal-500/20 text-teal-300 border-teal-500/30',      icon: '🎓' },
  };
  const { cls, icon } = cfg[status] ?? cfg.Pending;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${cls}`}>
      {icon} {status}
    </span>
  );
}

// ─── Contact link renderer ────────────────────────────────────────────────────
function ContactLink({ method, value }) {
  if (!method || !value) return null;

  const configs = {
    Email:     { href: `mailto:${value}`, icon: '✉', label: value, color: 'text-sky-300 hover:text-sky-200' },
    WhatsApp:  { href: `https://wa.me/${value.replace(/\D/g, '')}`, icon: '💬', label: `+${value}`, color: 'text-emerald-300 hover:text-emerald-200' },
    LinkedIn:  { href: value.startsWith('http') ? value : `https://${value}`, icon: '🔗', label: 'View LinkedIn', color: 'text-blue-300 hover:text-blue-200' },
  };
  const cfg = configs[method];
  if (!cfg) return <span className="text-gray-400 text-xs">{value}</span>;

  return (
    <a
      href={cfg.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 text-sm font-medium underline underline-offset-2 transition-colors ${cfg.color}`}
    >
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </a>
  );
}

// ─── Accepted / Scheduled / Completed contact panel ──────────────────────────
function ContactPanel({ req }) {
  const contact = req.otherUserContact;
  const otherName = req.direction === 'received' ? req.fromUser?.name : req.toUser?.name;
  const isScheduled = req.status === 'Scheduled';
  const isCompleted = req.status === 'Completed';

  return (
    <div className={`mt-4 rounded-2xl border p-4 space-y-3 ${
      isCompleted
        ? 'bg-teal-500/10 border-teal-500/30'
        : isScheduled
        ? 'bg-blue-500/10 border-blue-500/30'
        : 'bg-emerald-500/10 border-emerald-500/30'
    }`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span>{isCompleted ? '🎓' : isScheduled ? '📅' : '🎉'}</span>
        <span>
          {isCompleted
            ? 'Exchange Completed!'
            : isScheduled
            ? 'Session Scheduled'
            : 'Request Accepted!'}{' '}
        </span>
      </div>

      {/* Contact details */}
      {contact?.value ? (
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium">
            {otherName}&apos;s contact ({contact.method}):
          </p>
          <ContactLink method={contact.method} value={contact.value} />
        </div>
      ) : (
        <p className="text-xs text-gray-400">
          {otherName} hasn&apos;t added contact details yet. Reach out through the platform.
        </p>
      )}

      {/* Session details (Scheduled/Completed) */}
      {(isScheduled || isCompleted) && req.sessionLink && (
        <div className="pt-2 border-t border-white/10 space-y-1">
          <p className="text-xs text-gray-400 font-medium">Session details:</p>
          {req.sessionTime && (
            <p className="text-sm text-white">📅 {req.sessionTime}</p>
          )}
          <a
            href={req.sessionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 underline underline-offset-2"
          >
            🔗 Join session link
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Session scheduling mini-form ────────────────────────────────────────────
function ScheduleForm({ req, onSchedule, loading }) {
  const [link, setLink] = useState(req.sessionLink || '');
  const [time, setTime] = useState(req.sessionTime || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!link.trim() || !time.trim()) return;
    onSchedule(req.id, link.trim(), time.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 space-y-3"
    >
      <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
        📅 Schedule a Session
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="url"
          placeholder="Meet / Zoom link (https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          className="bg-[#181320] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
        />
        <input
          type="text"
          placeholder="Date & time (e.g. Oct 10, 7PM IST)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="bg-[#181320] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mauve-gradient-btn text-white text-xs font-semibold px-5 py-2 rounded-full disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity"
      >
        {loading ? 'Saving…' : 'Confirm Session'}
      </button>
    </form>
  );
}

// ─── Main Requests page ───────────────────────────────────────────────────────
function Requests({ requests, onUpdateRequestStatus, onScheduleSession, onCompleteSession }) {
  const [activeTab, setActiveTab] = useState('received');
  const [loadingId, setLoadingId] = useState(null);  // '<reqId>-<action>'
  const [toast, setToast] = useState(null);           // { message, type }

  const showToast = (message, type = 'success') => setToast({ message, type });
  const dismissToast = () => setToast(null);

  const received = requests.filter((r) => r.direction === 'received');
  const sent = requests.filter((r) => r.direction === 'sent');

  // ── Generic action wrapper with loading + toast ───────────────────────────
  const handleAction = async (reqId, action, extra) => {
    const key = `${reqId}-${action}`;
    setLoadingId(key);
    const toastMessages = {
      accept:   'Request accepted! 🎉',
      reject:   'Request rejected.',
      cancel:   'Request cancelled.',
      schedule: 'Session scheduled! 📅',
      complete: 'Exchange marked as completed! 🎓',
    };
    try {
      const ok = await onUpdateRequestStatus(reqId, action, extra);
      showToast(toastMessages[action] ?? 'Done.', ok === false ? 'error' : 'success');
    } catch {
      showToast('Something went wrong. Try again.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const isLoading = (id, action) => loadingId === `${id}-${action}`;

  // ── Request card ──────────────────────────────────────────────────────────
  const RequestCard = ({ req, actionArea }) => {
    const isSent = req.direction === 'sent';
    const otherUser = isSent ? req.toUser : req.fromUser;
    const showContact = ['Accepted', 'Scheduled', 'Completed'].includes(req.status);

    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-purple-400/30 transition-all space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Left: avatar + info */}
          <div className="flex items-start space-x-4">
            <Avatar src={otherUser?.avatar} name={otherUser?.name} size="md" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold text-white">
                  {isSent ? `To: ${otherUser?.name}` : otherUser?.name}
                </h3>
                <StatusBadge status={req.status} />
              </div>

              {req.message && (
                <p className="text-xs text-gray-300 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5 max-w-sm">
                  &ldquo;{req.message}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {isSent ? 'You teach' : 'They teach'}: {isSent ? req.mySkillToTeach : req.theirSkillToTeach}
                </span>
                <span className="text-gray-500">⇄</span>
                <span className="text-purple-300 font-medium bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  {isSent ? 'You learn' : 'They want'}: {isSent ? req.theirSkillToTeach : req.mySkillToTeach}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {isSent ? 'Sent' : 'Received'} on {req.createdAt || 'recently'}
              </p>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            {actionArea}
          </div>
        </div>

        {/* Contact panel — only when Accepted/Scheduled/Completed */}
        {showContact && <ContactPanel req={req} />}

        {/* Schedule form — only on Accepted requests */}
        {req.status === 'Accepted' && (
          <ScheduleForm
            req={req}
            loading={isLoading(req.id, 'schedule')}
            onSchedule={(id, link, time) => handleAction(id, 'schedule', { sessionLink: link, sessionTime: time })}
          />
        )}

        {/* Mark as Completed button — only on Scheduled */}
        {req.status === 'Scheduled' && (
          <div className="pt-2">
            <Button
              id={`complete-${req.id}`}
              variant="secondary"
              onClick={() => handleAction(req.id, 'complete')}
              disabled={loadingId !== null}
              className="text-xs px-4 py-2 border-teal-500/30 text-teal-300 hover:bg-teal-500/10 disabled:opacity-50"
            >
              {isLoading(req.id, 'complete') ? 'Marking…' : '🎓 Mark as Completed'}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 px-2">
      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-300">
          Skill Exchange Dashboard
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Manage{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">
            Requests
          </span>
        </h1>
        <p className="text-gray-300 text-sm max-w-xl">
          Review incoming invitations and track the status of exchanges you've initiated.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        {[{ key: 'received', label: 'Received', count: received.length },
          { key: 'sent',     label: 'Sent',     count: sent.length }].map(({ key, label, count }) => (
          <button
            key={key}
            id={`tab-${key}`}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === key
                ? 'mauve-gradient-btn text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* RECEIVED TAB */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {received.length > 0 ? (
            received.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                actionArea={
                  req.status === 'Pending' ? (
                    <div className="flex items-center space-x-2">
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
                  ) : null
                }
              />
            ))
          ) : (
            <EmptyState text="No received exchange requests yet." />
          )}
        </div>
      )}

      {/* SENT TAB */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sent.length > 0 ? (
            sent.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                actionArea={
                  req.status === 'Pending' ? (
                    <Button
                      id={`cancel-${req.id}`}
                      variant="secondary"
                      onClick={() => handleAction(req.id, 'cancel')}
                      disabled={loadingId !== null}
                      className="px-4 py-2 text-xs border-gray-500/30 text-gray-400 hover:bg-gray-500/10 hover:text-white disabled:opacity-50"
                    >
                      {isLoading(req.id, 'cancel') ? 'Cancelling…' : 'Cancel Request'}
                    </Button>
                  ) : null
                }
              />
            ))
          ) : (
            <EmptyState text="You haven't sent any exchange requests yet." />
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}

export default Requests;
