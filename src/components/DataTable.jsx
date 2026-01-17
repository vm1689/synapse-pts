import { type } from '../data';
import { useData } from '../context/DataContext';

const DataTable = () => {
  const { trialsData, changes, getExecSummary } = useData();

  // Sort by PTS score ascending (lowest first, needs review at top)
  const sortedData = [...trialsData].sort((a, b) => a.pts_score - b.pts_score);

  // Get exec summary from context
  const execSummary = getExecSummary();

  // Check if a field has changed for a trial
  const hasChanged = (trialId, field) => {
    return changes[trialId]?.[field];
  };

  // Check if any field changed for a trial
  const hasAnyChange = (trialId) => {
    return !!changes[trialId];
  };

  // Get change indicator style for cells
  const getChangeStyle = (trialId, field) => {
    if (hasChanged(trialId, field)) {
      return 'bg-purple-50 border-l-4 border-purple-400';
    }
    return '';
  };

  // Get row style for changed trials
  const getRowStyle = (trialId) => {
    if (hasAnyChange(trialId)) {
      return 'bg-purple-50/30 hover:bg-purple-100/50';
    }
    return 'bg-white hover:bg-blue-50/50';
  };

  const getPtsColor = (pts) => {
    if (pts >= 60) return 'bg-green-100 text-green-800 border-green-300';
    if (pts >= 40) return 'bg-amber-100 text-amber-700 border-amber-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  // Render PTS with change indicator
  const renderPts = (row) => {
    const ptsChange = row._pts_change;
    const hasChange = hasChanged(row.id, 'pts_score');

    return (
      <div className="flex flex-col items-start gap-1">
        <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-sm border ${getPtsColor(row.pts_score)}`}>
          {row.pts_score}%
        </span>
        {(ptsChange || hasChange) && (
          <div className="flex items-center gap-1">
            {ptsChange?.direction === 'up' ? (
              <span className="text-green-600 text-xs font-medium">▲ +{row.pts_score - ptsChange.previous}%</span>
            ) : ptsChange?.direction === 'down' ? (
              <span className="text-red-600 text-xs font-medium">▼ {row.pts_score - ptsChange.previous}%</span>
            ) : hasChange && (
              <span className="text-blue-600 text-xs font-medium">● Changed</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render cell with citations
  const renderWithCitations = (row, field, content) => {
    const citations = row._citations?.[field];
    const isChanged = hasChanged(row.id, field);

    // Highlight [UPDATE: ...] text prominently
    const highlightUpdates = (text) => {
      if (!text) return text;
      const parts = text.split(/(\[UPDATE:[^\]]+\])/g);
      return parts.map((part, i) => {
        if (part.startsWith('[UPDATE:')) {
          return (
            <span key={i} className="text-purple-800 font-semibold bg-purple-200 px-1.5 py-0.5 rounded border border-purple-300">
              {part}
            </span>
          );
        }
        return part;
      });
    };

    return (
      <div className={`${isChanged ? 'relative' : ''}`}>
        <p className="text-slate-600 text-sm leading-relaxed">
          {highlightUpdates(content)}
        </p>
        {citations && citations.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {citations.map((cite, i) => (
              <a
                key={i}
                href={cite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                title={`${cite.source}${cite.date ? ` (${cite.date})` : ''}`}
              >
                <span className="w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700">
                  {i + 1}
                </span>
                <span className="truncate max-w-[100px]">{cite.source}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Column definitions with widths
  const columns = [
    { key: 'pts_score', label: 'PTS', width: '90px' },
    { key: 'nct_id', label: 'NCT ID', width: '120px' },
    { key: 'trial_name', label: 'Trial Name', width: '140px' },
    { key: 'study_design', label: 'Study Design', width: '200px' },
    { key: 'drug_name', label: 'Drug Name', width: '120px' },
    { key: 'sponsor', label: 'Sponsor', width: '140px' },
    { key: 'drug_class', label: 'Drug Class', width: '150px' },
    { key: 'target', label: 'Target', width: '120px' },
    { key: 'indication', label: 'Indication', width: '180px' },
    { key: 'phase', label: 'Phase', width: '80px' },
    { key: 'patient_population', label: 'Patient Population', width: '200px' },
    { key: 'trial_timeline', label: 'Timeline', width: '120px' },
    { key: 'efficacy_data', label: 'Efficacy Data', width: '300px' },
    { key: 'safety_data', label: 'Safety Data', width: '280px' },
    { key: 'fda_designations', label: 'FDA Designations', width: '140px' },
    { key: 'competitive_landscape', label: 'Competitive Landscape', width: '280px' },
    { key: 'partnership_status', label: 'Partnership', width: '150px' },
  ];

  // Count changes
  const changedTrialsCount = Object.keys(changes).length;

  return (
    <div className="h-full flex flex-col">
      {/* Executive Summary */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="font-semibold text-black" style={type.pageTitle}>
            {execSummary.title}
          </h2>
          {changedTrialsCount > 0 && (
            <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full animate-pulse">
              {changedTrialsCount} trial{changedTrialsCount > 1 ? 's' : ''} updated
            </span>
          )}
        </div>
        <p className="text-black/70 leading-relaxed" style={type.body}>
          {execSummary.summary}
        </p>
      </div>

      <div className="ferma-data-table-container flex-1 overflow-auto rounded-lg border border-slate-200">
        <table className="ferma-data-table w-full" style={{ minWidth: '2800px', fontSize: '13px', lineHeight: '1.5' }}>
          <thead className="sticky top-0 z-10">
            <tr className="bg-white border-b-2 border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wide"
                  style={{ width: col.width, minWidth: col.width, fontSize: '11px' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((row) => (
              <tr key={row.id} className={`${getRowStyle(row.id)} transition-colors`}>
                <td className={`py-3 px-4 align-top ${getChangeStyle(row.id, 'pts_score')}`}>
                  {renderPts(row)}
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="font-mono text-slate-500 text-xs">{row.nct_id}</span>
                </td>
                <td className="py-3 px-4 align-top">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{row.trial_name}</span>
                    {hasAnyChange(row.id) && (
                      <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded uppercase">
                        Updated
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="text-slate-600">{row.study_design}</span>
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="font-medium text-slate-800">{row.drug_name}</span>
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="text-slate-600">{row.sponsor}</span>
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="text-slate-600">{row.drug_class}</span>
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="text-slate-600 font-medium">{row.target}</span>
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="text-slate-700">{row.indication}</span>
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-xs font-medium">
                    {row.phase}
                  </span>
                </td>
                <td className={`py-3 px-4 align-top ${getChangeStyle(row.id, 'patient_population')}`}>
                  <span className="text-slate-600 text-sm">{row.patient_population}</span>
                </td>
                <td className={`py-3 px-4 align-top ${getChangeStyle(row.id, 'trial_timeline')}`}>
                  <span className="text-slate-600 font-medium">{row.trial_timeline}</span>
                </td>
                <td className={`py-3 px-4 align-top ${getChangeStyle(row.id, 'efficacy_data')}`}>
                  {renderWithCitations(row, 'efficacy_data', row.efficacy_data)}
                </td>
                <td className={`py-3 px-4 align-top ${getChangeStyle(row.id, 'safety_data')}`}>
                  {renderWithCitations(row, 'safety_data', row.safety_data)}
                </td>
                <td className={`py-3 px-4 align-top ${getChangeStyle(row.id, 'fda_designations')}`}>
                  {renderWithCitations(row, 'fda_designations', row.fda_designations)}
                </td>
                <td className={`py-3 px-4 align-top ${getChangeStyle(row.id, 'competitive_landscape')}`}>
                  {renderWithCitations(row, 'competitive_landscape', row.competitive_landscape)}
                </td>
                <td className="py-3 px-4 align-top">
                  <span className="text-slate-600">{row.partnership_status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
