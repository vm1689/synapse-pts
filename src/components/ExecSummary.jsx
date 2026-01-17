import { type, trialsData } from '../data';

const ExecSummary = () => {
  // Calculate portfolio metrics
  const avgPts = Math.round(trialsData.reduce((sum, t) => sum + t.pts_score, 0) / trialsData.length);
  const highPtsTrials = trialsData.filter(t => t.pts_score >= 70);
  const lowPtsTrials = trialsData.filter(t => t.pts_score < 40);
  const phase3Trials = trialsData.filter(t => t.phase === 'Phase 3');
  const phase3AvgPts = phase3Trials.length > 0
    ? Math.round(phase3Trials.reduce((sum, t) => sum + t.pts_score, 0) / phase3Trials.length)
    : 0;

  // Get specific trials for narrative
  const topTrial = [...trialsData].sort((a, b) => b.pts_score - a.pts_score)[0];
  const bottomTrial = [...trialsData].sort((a, b) => a.pts_score - b.pts_score)[0];

  return (
    <article className="max-w-2xl">
      {/* Byline */}
      <p className="text-black/40 mb-3 uppercase tracking-wider font-medium" style={type.caption}>
        Portfolio Intelligence Report • January 2026
      </p>

      {/* Headline */}
      <h1 className="text-black font-bold leading-tight mb-6" style={{ fontSize: '28px', lineHeight: '34px' }}>
        Clinical Portfolio Shows {avgPts}% Average Success Probability as {lowPtsTrials.length} Trials Face Headwinds
      </h1>

      {/* Paragraph 1 - The Lede */}
      <p className="text-black/80 mb-5 leading-relaxed" style={type.body}>
        The company's clinical portfolio of {trialsData.length} active trials carries an average probability of technical success of {avgPts}%, according to the latest analysis. {topTrial.drug_name}, a {topTrial.drug_class.toLowerCase()} targeting {topTrial.target} in {topTrial.indication}, leads the portfolio with a {topTrial.pts_score}% success probability, bolstered by {topTrial.fda_designations !== 'None' ? topTrial.fda_designations + ' designation and ' : ''}strong Phase 2 efficacy signals. The {phase3Trials.length} Phase 3 programs collectively average {phase3AvgPts}% PTS, positioning the late-stage pipeline favorably against industry benchmarks.
      </p>

      {/* Paragraph 2 - The Tension */}
      <p className="text-black/80 mb-5 leading-relaxed" style={type.body}>
        However, {lowPtsTrials.length} trials now sit below the 40% threshold that typically triggers steering committee review. {bottomTrial.drug_name}, the {bottomTrial.phase} {bottomTrial.indication} program, has fallen to {bottomTrial.pts_score}% PTS amid {bottomTrial.competitive_landscape.toLowerCase()}. The trial's {bottomTrial.safety_data.toLowerCase()} profile and {bottomTrial.cash_runway} cash runway add operational complexity. Portfolio leaders are weighing protocol amendments against the competitive clock, particularly as several rivals advance through registration trials.
      </p>

      {/* Paragraph 3 - The Outlook */}
      <p className="text-black/80 mb-5 leading-relaxed" style={type.body}>
        Near-term catalysts could reshape the portfolio's trajectory. {highPtsTrials.length} programs above 70% PTS—spanning oncology, cardiovascular, and ophthalmology—are approaching pivotal readouts that could validate the portfolio's risk-adjusted value. The next 90 days will prove decisive: positive data from lead assets could offset setbacks in earlier-stage programs, while safety signals or competitive losses would pressure an already bifurcated pipeline. Management has scheduled steering committee sessions to address the underperforming assets before quarter-end.
      </p>
    </article>
  );
};

export default ExecSummary;
