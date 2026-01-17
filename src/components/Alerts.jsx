import { type, ptsAlertsData } from '../data';

const Alerts = ({ selectedAlert, setSelectedAlert }) => {
  const getTypeColor = (alertType) => {
    switch (alertType) {
      case 'PTS Drop':
      case 'Safety Signal':
        return 'text-red-600';
      case 'Phase Transition':
        return 'text-blue-600';
      case 'Competitive Event':
        return 'text-purple-600';
      case 'Regulatory Update':
        return 'text-green-600';
      case 'Enrollment Milestone':
        return 'text-teal-600';
      default:
        return 'text-black/60';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="ferma-alerts-container h-full">
      {/* Alerts List */}
      <div className="ferma-alerts-list py-4 pr-4">
        {ptsAlertsData.map((alert, index) => (
          <div
            key={alert.id}
            onClick={() => setSelectedAlert(index)}
            className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${selectedAlert === index ? 'bg-violet-50 border border-violet-200' : 'hover:bg-black/[0.02] border border-transparent'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-black/30" style={type.caption}>{alert.date}</span>
              <span className="text-black/30">·</span>
              <span className={`font-medium ${getTypeColor(alert.type)}`} style={type.caption}>
                {alert.type}
              </span>
              <span className={`px-1.5 py-0.5 rounded font-semibold border ${getSeverityBadge(alert.severity)}`} style={type.badge}>
                {alert.severity}
              </span>
            </div>
            <p className="text-black font-medium" style={type.small}>{alert.headline}</p>
          </div>
        ))}
      </div>

      {/* Alert Detail */}
      <div className="ferma-alerts-detail py-4">
        {ptsAlertsData[selectedAlert] && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-black/50" style={type.caption}>{ptsAlertsData[selectedAlert].date}</span>
              <span className="text-black/30">·</span>
              <span className={`font-medium ${getTypeColor(ptsAlertsData[selectedAlert].type)}`} style={type.caption}>
                {ptsAlertsData[selectedAlert].type}
              </span>
              <span className={`px-1.5 py-0.5 rounded font-semibold border ${getSeverityBadge(ptsAlertsData[selectedAlert].severity)}`} style={type.badge}>
                {ptsAlertsData[selectedAlert].severity}
              </span>
            </div>

            <h2 className="text-black font-semibold mb-5" style={type.sectionTitle}>
              {ptsAlertsData[selectedAlert].headline}
            </h2>

            <div className="space-y-4 mb-6">
              {ptsAlertsData[selectedAlert].content.map((paragraph, i) => (
                <p key={i} className="text-black/70 leading-relaxed" style={type.small}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-4 border-t border-black/10">
              <p className="text-black/50" style={type.caption}>
                {ptsAlertsData[selectedAlert].source}, {ptsAlertsData[selectedAlert].sourceDate}
              </p>
              <a href="#" className="text-black/40 hover:underline" style={type.caption}>
                {ptsAlertsData[selectedAlert].sourceUrl} →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
