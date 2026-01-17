import { type, trialsData } from '../data';

const Reports = () => {
  // Calculate average PTS by phase
  const phaseData = trialsData.reduce((acc, trial) => {
    const phase = trial.phase;
    if (!acc[phase]) {
      acc[phase] = { total: 0, count: 0 };
    }
    acc[phase].total += trial.pts_score;
    acc[phase].count += 1;
    return acc;
  }, {});

  const avgPtsByPhase = Object.entries(phaseData).map(([phase, data]) => ({
    phase,
    avgPts: Math.round(data.total / data.count),
    count: data.count
  })).sort((a, b) => {
    const order = ['Phase 1/2', 'Phase 2', 'Phase 2b', 'Phase 3'];
    return order.indexOf(a.phase) - order.indexOf(b.phase);
  });

  // Calculate trials by therapeutic area
  const taData = trialsData.reduce((acc, trial) => {
    const ta = trial.therapeutic_area;
    if (!acc[ta]) {
      acc[ta] = { count: 0, totalPts: 0 };
    }
    acc[ta].count += 1;
    acc[ta].totalPts += trial.pts_score;
    return acc;
  }, {});

  const trialsByTA = Object.entries(taData).map(([ta, data]) => ({
    ta,
    count: data.count,
    avgPts: Math.round(data.totalPts / data.count)
  })).sort((a, b) => b.count - a.count);

  // Portfolio risk assessment
  const riskAssessment = [
    {
      level: 'High',
      trials: trialsData.filter(t => t.risk_level === 'High'),
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      level: 'Moderate',
      trials: trialsData.filter(t => t.risk_level === 'Moderate'),
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      level: 'Low',
      trials: trialsData.filter(t => t.risk_level === 'Low'),
      color: 'bg-green-50 text-green-700 border-green-200'
    }
  ];

  const getPtsBarColor = (pts) => {
    if (pts >= 60) return 'bg-green-500';
    if (pts >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      <h2 className="font-semibold text-black mb-5" style={type.pageTitle}>Portfolio PTS Analysis</h2>

      <div className="space-y-8">
        {/* Average PTS by Phase */}
        <div className="p-5 bg-gray-50 rounded-lg border border-black/10">
          <p className="text-black font-semibold mb-4" style={type.sectionTitle}>Average PTS by Phase</p>
          <div className="space-y-3">
            {avgPtsByPhase.map(({ phase, avgPts, count }) => (
              <div key={phase} className="flex items-center gap-4" style={type.small}>
                <span className="text-black/70 w-24">{phase}</span>
                <div className="flex-1 h-6 bg-black/5 rounded overflow-hidden">
                  <div
                    className={`h-full ${getPtsBarColor(avgPts)} transition-all`}
                    style={{ width: `${avgPts}%` }}
                  />
                </div>
                <span className="text-black font-semibold w-12">{avgPts}%</span>
                <span className="text-black/40">({count} trials)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trials by Therapeutic Area */}
        <div className="p-5 bg-gray-50 rounded-lg border border-black/10">
          <p className="text-black font-semibold mb-4" style={type.sectionTitle}>Trials by Therapeutic Area</p>
          <div className="grid grid-cols-3 gap-3">
            {trialsByTA.map(({ ta, count, avgPts }) => (
              <div key={ta} className="p-3 bg-white rounded border border-black/5">
                <p className="text-black font-medium" style={type.small}>{ta}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-black/70 font-bold" style={type.metric}>{count}</span>
                  <span className="text-black/40" style={type.caption}>trial{count > 1 ? 's' : ''}</span>
                </div>
                <p className="text-black/50 mt-1" style={type.caption}>Avg PTS: {avgPts}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Risk Assessment */}
        <div className="p-5 bg-gray-50 rounded-lg border border-black/10">
          <p className="text-black font-semibold mb-4" style={type.sectionTitle}>Portfolio Risk Assessment</p>
          <table className="w-full" style={type.small}>
            <thead>
              <tr className="border-b-2 border-black/10">
                <th className="text-left py-2.5 pr-4 font-semibold text-black/60">Risk Level</th>
                <th className="text-left py-2.5 px-4 font-semibold text-black/60">Count</th>
                <th className="text-left py-2.5 px-4 font-semibold text-black/60">Avg PTS</th>
                <th className="text-left py-2.5 pl-4 font-semibold text-black/60">Trials</th>
              </tr>
            </thead>
            <tbody>
              {riskAssessment.map(({ level, trials, color }) => (
                <tr key={level} className="border-b border-black/5">
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded font-semibold border ${color}`} style={type.badge}>
                      {level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-black font-semibold">{trials.length}</td>
                  <td className="py-3 px-4 text-black/70">
                    {trials.length > 0
                      ? Math.round(trials.reduce((sum, t) => sum + t.pts_score, 0) / trials.length) + '%'
                      : '—'}
                  </td>
                  <td className="py-3 pl-4 text-black/60" style={type.caption}>
                    {trials.map(t => t.trial_name).join(', ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3">
          <button className="h-9 px-4 bg-violet-600 text-white rounded-md font-medium hover:bg-violet-700 transition-colors" style={type.small}>
            Export PDF Report
          </button>
          <button className="h-9 px-4 bg-white border border-black/20 text-black/70 rounded-md font-medium hover:bg-black/5 transition-colors" style={type.small}>
            Export CSV Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
