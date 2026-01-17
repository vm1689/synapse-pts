// Parser for content.md - extracts plan sections, trials data, and exec summary template

export function parseContent(markdown) {
  const result = {
    planSections: [],
    trialsData: [],
    execSummaryTemplate: '',
    lastRefreshed: new Date().toISOString(),
  };

  // Extract Last Refreshed from comment
  const refreshMatch = markdown.match(/<!-- Last Refreshed: ([^>]+) -->/);
  if (refreshMatch) {
    result.lastRefreshed = refreshMatch[1].trim();
  }

  // Extract Plan sections
  const planMatch = markdown.match(/## Plan\n([\s\S]*?)(?=## Executive Summary|## Trials|$)/);
  if (planMatch) {
    const planContent = planMatch[1];

    // Parse Objective
    const objectiveMatch = planContent.match(/### Objective\n([\s\S]*?)(?=###|$)/);
    if (objectiveMatch) {
      result.planSections.push({
        title: 'Objective',
        steps: [{ title: objectiveMatch[1].trim() }]
      });
    }

    // Parse Clinical Factors
    const clinicalMatch = planContent.match(/### Clinical Factors\n([\s\S]*?)(?=###|$)/);
    if (clinicalMatch) {
      const steps = parseListItems(clinicalMatch[1]);
      result.planSections.push({
        title: 'Clinical Factors',
        steps
      });
    }

    // Parse Strategic Factors
    const strategicMatch = planContent.match(/### Strategic Factors\n([\s\S]*?)(?=###|$)/);
    if (strategicMatch) {
      const steps = parseListItems(strategicMatch[1]);
      result.planSections.push({
        title: 'Strategic Factors',
        steps
      });
    }

    // Parse Output & Actions
    const outputMatch = planContent.match(/### Output & Actions\n([\s\S]*?)(?=##|$)/);
    if (outputMatch) {
      const steps = parseListItems(outputMatch[1]);
      result.planSections.push({
        title: 'Output & Actions',
        steps
      });
    }
  }

  // Extract Executive Summary template
  const execMatch = markdown.match(/## Executive Summary\n\n([\s\S]*?)\n\n([\s\S]*?)(?=## Trials|$)/);
  if (execMatch) {
    result.execSummaryTitle = execMatch[1].trim();
    result.execSummaryTemplate = execMatch[2].trim();
  }

  // Extract Trials JSON
  const trialsMatch = markdown.match(/```json\n([\s\S]*?)\n```/);
  if (trialsMatch) {
    try {
      result.trialsData = JSON.parse(trialsMatch[1]);
    } catch (e) {
      console.error('Failed to parse trials JSON:', e);
    }
  }

  return result;
}

function parseListItems(content) {
  const items = [];
  const regex = /- \*\*([^*]+)\*\*:\s*([^\n]+)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    items.push({
      title: match[1].trim(),
      description: match[2].trim()
    });
  }

  return items;
}

// Generate exec summary dynamically from objective and data (equity research style)
export function formatExecSummary(template, titleTemplate, trialsData) {
  const totalTrials = trialsData.length;
  const sortedData = [...trialsData].sort((a, b) => a.pts_score - b.pts_score);

  // Categorize by PTS thresholds from objective
  const highConviction = sortedData.filter(t => t.pts_score >= 60);
  const moderate = sortedData.filter(t => t.pts_score >= 40 && t.pts_score < 60);
  const belowThreshold = sortedData.filter(t => t.pts_score < 40);

  const lowestTrial = sortedData[0];
  const topTrial = sortedData[sortedData.length - 1];

  // Calculate portfolio average
  const avgPts = Math.round(trialsData.reduce((sum, t) => sum + t.pts_score, 0) / totalTrials);

  // Build title (research report style)
  const title = `Portfolio PTS Review: ${highConviction.length} High Conviction, ${belowThreshold.length} Flagged`;

  // Build equity research style summary
  const summary = `${topTrial.trial_name} (${topTrial.pts_score}% PTS) emerges as the key near-term catalyst in ${topTrial.indication}, supported by strong prior data and favorable competitive positioning. Portfolio risk centers on ${lowestTrial.trial_name} (${lowestTrial.pts_score}% PTS) where ${lowestTrial.indication} headwinds and execution concerns warrant a go/no-go review. Across ${totalTrials} programs, ${highConviction.length} score above the 60% conviction threshold while ${belowThreshold.length} fall below the 40% investment floor—capital reallocation from below-threshold assets to higher-probability readouts merits consideration. Portfolio average PTS: ${avgPts}%.`;

  return { title, summary };
}
