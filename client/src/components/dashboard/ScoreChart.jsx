import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ScoreChart({ data }) {
  if (!data?.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">No score history yet. Run an ATS analysis.</p>
    );
  }

  const chartData = data.map((item, i) => ({
    name: new Date(item.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    score: item.atsScore,
    index: i,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
