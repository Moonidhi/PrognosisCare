const chatItems = [
  {
    id: 1,
    source: 'AI Assistant',
    text: 'Recommended ECG and lipid profile based on symptom pattern.',
    date: '2026-02-12 09:45 AM',
  },
  {
    id: 2,
    source: 'Reception Bot',
    text: 'Your lab booking is confirmed for 20 Feb, 10:30 AM.',
    date: '2026-02-13 04:10 PM',
  },
];

function ChatHistoryPage() {
  return (
    <div className="page-shell">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Conversation Log</p>
        <h2 className="mt-1 text-xl font-semibold">Chat History</h2>
        <div className="mt-4 space-y-3">
          {chatItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-100 p-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{item.source}</span>
                <span>{item.date}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ChatHistoryPage;
