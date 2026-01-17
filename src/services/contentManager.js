// Content Manager - handles base data, current data, and change tracking
import { parseContent, formatExecSummary } from '../data/parseContent';

// Store for current content state
let currentContent = null;
let baseContent = null;
let changes = {};

// Fields to track for changes
const TRACKED_FIELDS = [
  'pts_score', 'efficacy_data', 'safety_data', 'competitive_landscape',
  'trial_timeline', 'fda_designations', 'patient_population'
];

// Initialize with base and current content
export function initContent(baseMarkdown, currentMarkdown) {
  baseContent = parseContent(baseMarkdown);
  currentContent = parseContent(currentMarkdown);
  changes = computeChanges(baseContent.trialsData, currentContent.trialsData);
  return {
    content: currentContent,
    changes,
    isBase: baseMarkdown === currentMarkdown
  };
}

// Load base content
export function loadBaseContent(baseMarkdown) {
  baseContent = parseContent(baseMarkdown);
  currentContent = baseContent;
  changes = {};
  return {
    content: baseContent,
    changes: {},
    isBase: true
  };
}

// Update content with research results
export function updateContentWithResearch(researchResults, citations) {
  if (!currentContent) return null;

  const updatedTrials = currentContent.trialsData.map(trial => {
    const research = researchResults.find(r => r.trial_id === trial.id);
    if (!research || research.error || !research.research_data) {
      return trial;
    }

    const updates = research.research_data.trial_updates || [];
    const ptsAdjustment = research.research_data.suggested_pts_adjustment;

    // Build updated trial data
    const updatedTrial = { ...trial };

    // Aggregate updates by category
    const efficacyUpdates = updates.filter(u => u.category === 'efficacy');
    const safetyUpdates = updates.filter(u => u.category === 'safety');
    const competitiveUpdates = updates.filter(u => u.category === 'competitive');
    const regulatoryUpdates = updates.filter(u => u.category === 'regulatory');

    // Update efficacy data if new info
    if (efficacyUpdates.length > 0) {
      const newInfo = efficacyUpdates.map(u => u.summary).join(' ');
      updatedTrial.efficacy_data = `${trial.efficacy_data} [NEW: ${newInfo}]`;
      updatedTrial._citations = updatedTrial._citations || {};
      updatedTrial._citations.efficacy_data = efficacyUpdates.map(u => ({
        source: u.source_name || u.source_url,
        url: u.source_url,
        date: u.date
      }));
    }

    // Update safety data if new info
    if (safetyUpdates.length > 0) {
      const newInfo = safetyUpdates.map(u => u.summary).join(' ');
      updatedTrial.safety_data = `${trial.safety_data} [NEW: ${newInfo}]`;
      updatedTrial._citations = updatedTrial._citations || {};
      updatedTrial._citations.safety_data = safetyUpdates.map(u => ({
        source: u.source_name || u.source_url,
        url: u.source_url,
        date: u.date
      }));
    }

    // Update competitive landscape if new info
    if (competitiveUpdates.length > 0) {
      const newInfo = competitiveUpdates.map(u => u.summary).join(' ');
      updatedTrial.competitive_landscape = `${trial.competitive_landscape} [NEW: ${newInfo}]`;
      updatedTrial._citations = updatedTrial._citations || {};
      updatedTrial._citations.competitive_landscape = competitiveUpdates.map(u => ({
        source: u.source_name || u.source_url,
        url: u.source_url,
        date: u.date
      }));
    }

    // Update FDA designations if new info
    if (regulatoryUpdates.length > 0) {
      const newInfo = regulatoryUpdates.map(u => u.summary).join(' ');
      if (trial.fda_designations === 'N/A') {
        updatedTrial.fda_designations = `[NEW: ${newInfo}]`;
      } else {
        updatedTrial.fda_designations = `${trial.fda_designations} [NEW: ${newInfo}]`;
      }
      updatedTrial._citations = updatedTrial._citations || {};
      updatedTrial._citations.fda_designations = regulatoryUpdates.map(u => ({
        source: u.source_name || u.source_url,
        url: u.source_url,
        date: u.date
      }));
    }

    // Adjust PTS score if suggested
    if (ptsAdjustment && ptsAdjustment.direction !== 'unchanged') {
      const adjustment = ptsAdjustment.magnitude || 5;
      if (ptsAdjustment.direction === 'up') {
        updatedTrial.pts_score = Math.min(100, trial.pts_score + adjustment);
      } else {
        updatedTrial.pts_score = Math.max(0, trial.pts_score - adjustment);
      }
      updatedTrial._pts_change = {
        previous: trial.pts_score,
        current: updatedTrial.pts_score,
        rationale: ptsAdjustment.rationale
      };
    }

    return updatedTrial;
  });

  // Update current content
  currentContent = {
    ...currentContent,
    trialsData: updatedTrials,
    lastRefreshed: new Date().toISOString()
  };

  // Recompute changes vs base
  changes = computeChanges(baseContent.trialsData, currentContent.trialsData);

  return {
    content: currentContent,
    changes,
    isBase: false
  };
}

// Compute changes between base and current data
function computeChanges(baseTrials, currentTrials) {
  const changes = {};

  currentTrials.forEach(currentTrial => {
    const baseTrial = baseTrials.find(t => t.id === currentTrial.id);
    if (!baseTrial) return;

    const trialChanges = {};

    TRACKED_FIELDS.forEach(field => {
      if (currentTrial[field] !== baseTrial[field]) {
        trialChanges[field] = {
          previous: baseTrial[field],
          current: currentTrial[field],
          changed: true
        };
      }
    });

    if (Object.keys(trialChanges).length > 0) {
      changes[currentTrial.id] = trialChanges;
    }
  });

  return changes;
}

// Generate markdown content from current state
export function generateMarkdown(content) {
  const timestamp = new Date().toISOString();

  let markdown = `# Synapse PTS Tracker Content

<!-- Last Refreshed: ${timestamp} -->

## Plan

### Objective
${content.planSections.find(s => s.title === 'Objective')?.steps[0]?.title || ''}

### Clinical Factors
${content.planSections.find(s => s.title === 'Clinical Factors')?.steps.map(s => `- **${s.title}**: ${s.description}`).join('\n') || ''}

### Strategic Factors
${content.planSections.find(s => s.title === 'Strategic Factors')?.steps.map(s => `- **${s.title}**: ${s.description}`).join('\n') || ''}

### Output & Actions
${content.planSections.find(s => s.title === 'Output & Actions')?.steps.map(s => `- **${s.title}**: ${s.description}`).join('\n') || ''}

## Executive Summary

Portfolio Action Required

(Auto-generated from data)

## Trials

\`\`\`json
${JSON.stringify(content.trialsData.map(t => {
    // Remove internal tracking fields before serializing
    const { _citations, _pts_change, ...cleanTrial } = t;
    return cleanTrial;
  }), null, 2)}
\`\`\`
`;

  return markdown;
}

// Get current state
export function getCurrentState() {
  return {
    content: currentContent,
    baseContent,
    changes,
    isBase: !changes || Object.keys(changes).length === 0
  };
}

// Get exec summary
export function getExecSummary() {
  if (!currentContent) return { title: '', summary: '' };
  return formatExecSummary(
    currentContent.execSummaryTemplate,
    currentContent.execSummaryTitle,
    currentContent.trialsData
  );
}

export default {
  initContent,
  loadBaseContent,
  updateContentWithResearch,
  generateMarkdown,
  getCurrentState,
  getExecSummary
};
