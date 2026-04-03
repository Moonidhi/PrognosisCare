import { useState } from 'react';

function ReceptionChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <section className="mb-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Ask Reception</h3>
            <button type="button" className="text-xs text-slate-500" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            Hello! I can help with appointments, billing, and report status.
          </div>

          <div className="mt-3 flex gap-2">
            <input
              className="input"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="button" className="rounded-xl border border-slate-200 px-3 text-lg" aria-label="Voice input">
              🎤
            </button>
          </div>
          <button type="button" className="btn-primary mt-3 w-full">
            Send
          </button>
        </section>
      ) : null}

      <button
        type="button"
        className="btn-primary rounded-full px-5 py-3 shadow-card"
        onClick={() => setOpen((prev) => !prev)}
      >
        Ask Reception
      </button>
    </div>
  );
}

export default ReceptionChatWidget;
