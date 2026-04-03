import { Link } from 'react-router-dom';
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, ReferenceLine, Cell,
  PieChart, Pie
} from 'recharts';

function AIHealthInsightCard({ insight }) {
  if (!insight?.recentSymptoms?.trim()) return null;

  // Data for Risk Comparison Bar Chart
  const riskComparisonData = [
    { name: 'Avg Population', score: 35, fill: '#94a3b8' }, // Gray
    { name: 'Your Score', score: insight.riskScore, fill: insight.riskLevel === 'High' ? '#ef4444' : insight.riskLevel === 'Medium' ? '#f59e0b' : '#10b981' }, // Dynamic Color
    { name: 'Critical Limit', score: 85, fill: '#cbd5e1' }, // Light Gray
  ];

  // Data for Confidence Gauge (Pie Chart)
  // We create a "gauge" by using a half-pie (startAngle 180, endAngle 0)
  const confidenceData = [
    { name: 'Confidence', value: insight.riskScore, fill: '#3b82f6' }, // Blue
    { name: 'Uncertainty', value: 100 - insight.riskScore, fill: '#e2e8f0' }, // Light Gray
  ];

  return (
    <section className="card">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">📊</span> Your AI Health Analysis
      </h2>
      <p className="mt-2 text-sm text-slate-600 italic">Based on your recent symptoms: "{insight.recentSymptoms}"</p>

      {/* Top Row: Risk Score & Department */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Risk Assessment</p>
          <div className={`text-3xl font-extrabold ${insight.riskLevel === 'High' ? 'text-red-600' : insight.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
            {insight.riskLevel}
          </div>
          <p className="text-xs text-slate-400 mt-1">Severity Level</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Recommended Specialist</p>
          <div className="text-xl font-bold text-slate-800 text-balance">
            {insight.recommendedDepartment}
          </div>
          <p className="text-xs text-slate-400 mt-1">Based on symptom patterns</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Chart 1: Risk Comparison (Bar) */}
        <div className="rounded-xl border border-slate-100 p-4 bg-white">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-4 text-center">Risk vs. Population</p>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskComparisonData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                  {riskComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <ReferenceLine y={85} stroke="red" strokeDasharray="3 3" label={{ position: 'right', value: 'High Risk', fontSize: 10, fill: 'red' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Trends (Line) */}
        <div className="rounded-xl border border-slate-100 p-4 bg-white">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-4 text-center">7-Day Health Trend</p>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insight.trend}>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b' }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: AI Confidence (Pie/Gauge) - Full Width on Mobile, split on large */}
      <div className="mt-4 rounded-xl border border-slate-100 p-4 bg-white flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="h-32 w-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {confidenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-blue-600">{insight.riskScore}%</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</span>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="font-semibold text-slate-800">AI Model Confidence</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Our <span className="text-blue-600 font-medium">Gemini 2.0 Flash</span> model analyzed your symptoms with {insight.riskScore > 80 ? 'high' : 'moderate'} certainty.
            Always consult a doctor for a physical examination.
          </p>
        </div>
      </div>

      {/* AI Reasoning Section */}
      {insight.reasoning && insight.reasoning.length > 0 && (
        <div className="mt-4 rounded-xl bg-indigo-50 p-5 border border-indigo-100">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700 mb-3">
            <span>🧠</span> AI Reasoning & Key Factors
          </p>
          <ul className="grid gap-2">
            {insight.reasoning.map((reason, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-indigo-900 bg-white/60 p-2 rounded-lg border border-indigo-100/50">
                <span className="text-indigo-500 font-bold">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pending Tests */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Recommended Diagnostics</p>
        {insight.pendingTests.length ? (
          <div className="flex flex-wrap gap-2">
            {insight.pendingTests.map((test) => (
              <span key={test} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                🔬 {test}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No specific tests required at this stage.</p>
        )}
      </div>

      <Link to="/triage" className="btn-primary mt-6 w-full flex items-center justify-center gap-2 group">
        <span>Run New Analysis</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </section>
  );
}

export default AIHealthInsightCard;
