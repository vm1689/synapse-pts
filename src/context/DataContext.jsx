// Data Context - manages application state
import { createContext, useContext, useState, useCallback } from 'react';
import { parseContent, formatExecSummary } from '../data/parseContent';
import { researchTrials, abortResearch } from '../services/yutoriService';
import { mergeResearch, generateFilename, saveContent } from '../services/anthropicService';
import baseContentMd from '../data/content.base.md?raw';
import currentContentMd from '../data/content.md?raw';

const DataContext = createContext(null);

const TRACKED_FIELDS = [
  'pts_score', 'efficacy_data', 'safety_data', 'competitive_landscape',
  'trial_timeline', 'fda_designations', 'patient_population'
];

export function DataProvider({ children }) {
  const [baseContent] = useState(() => parseContent(baseContentMd));
  const [currentContent, setCurrentContent] = useState(() => parseContent(currentContentMd));
  const [changes, setChanges] = useState({});
  const [isBase, setIsBase] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState('');
  const [lastRefreshTime, setLastRefreshTime] = useState(currentContent.lastRefreshed);

  // Compute changes between base and current
  const computeChanges = useCallback((baseTrials, currentTrials) => {
    const result = {};
    currentTrials.forEach(current => {
      const base = baseTrials.find(t => t.id === current.id);
      if (!base) return;

      const trialChanges = {};
      TRACKED_FIELDS.forEach(field => {
        if (current[field] !== base[field]) {
          trialChanges[field] = { previous: base[field], current: current[field] };
        }
      });

      if (Object.keys(trialChanges).length > 0) {
        result[current.id] = trialChanges;
      }
    });
    return result;
  }, []);

  // Load base content
  const loadBase = useCallback(() => {
    setCurrentContent(baseContent);
    setChanges({});
    setIsBase(true);
    setLastRefreshTime(baseContent.lastRefreshed);
  }, [baseContent]);

  // Refresh with research
  const refreshWithResearch = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshProgress('Starting...');

    try {
      // Step 1: Yutori research → saves to yutori-output.md
      console.log('[Refresh] Step 1: Yutori research');
      const yutoriResult = await researchTrials(currentContent.trialsData, setRefreshProgress);

      if (!yutoriResult.success) {
        if (yutoriResult.cancelled) {
          setRefreshProgress('Cancelled');
          return;
        }
        throw new Error(yutoriResult.error || 'Research failed');
      }

      // Step 2: Claude reads yutori-output.md → saves to claude-output.md
      console.log('[Refresh] Step 2: Claude merge');
      const updatedMarkdown = await mergeResearch(baseContentMd, setRefreshProgress);

      // Step 3: Download the file
      console.log('[Refresh] Step 3: Save file');
      const filename = generateFilename();
      saveContent(updatedMarkdown, filename);
      setRefreshProgress(`Saved: ${filename}`);

      // Step 4: Update UI from claude-output.md
      console.log('[Refresh] Step 4: Update UI');
      const updatedContent = parseContent(updatedMarkdown);
      const updatedTrials = updatedContent.trialsData.map(trial => {
        const baseTrial = baseContent.trialsData.find(t => t.id === trial.id);
        if (baseTrial && baseTrial.pts_score !== trial.pts_score) {
          return {
            ...trial,
            _pts_change: {
              previous: baseTrial.pts_score,
              current: trial.pts_score,
              direction: trial.pts_score > baseTrial.pts_score ? 'up' : 'down'
            }
          };
        }
        return trial;
      });

      const newTimestamp = new Date().toISOString();
      console.log('[Refresh] Setting new timestamp:', newTimestamp);
      setCurrentContent({ ...updatedContent, trialsData: updatedTrials, lastRefreshed: newTimestamp });
      setChanges(computeChanges(baseContent.trialsData, updatedTrials));
      setIsBase(false);
      setLastRefreshTime(newTimestamp);
      setRefreshProgress('Complete');

      console.log('[Refresh] Done, lastRefreshTime updated to:', newTimestamp);

    } catch (error) {
      console.error('[Refresh] Error:', error);
      setRefreshProgress(`Error: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  }, [currentContent, baseContent, computeChanges]);

  // Stop research
  const stopResearch = useCallback(() => {
    abortResearch();
    setRefreshProgress('Stopping...');
  }, []);

  // Get exec summary
  const getExecSummary = useCallback(() => {
    return formatExecSummary(
      currentContent.execSummaryTemplate,
      currentContent.execSummaryTitle,
      currentContent.trialsData
    );
  }, [currentContent]);

  // Load data from claude-output.md file
  const loadFromClaudeOutput = useCallback(async () => {
    try {
      console.log('[Preview] Starting load...');
      const response = await fetch('/api/read-debug?filename=claude-output.md');
      if (!response.ok) {
        console.error('[Preview] No claude-output.md file found, status:', response.status);
        alert('No claude-output.md file found');
        return;
      }
      const markdown = await response.text();
      console.log('[Preview] Loaded claude-output.md, length:', markdown.length);
      console.log('[Preview] First 200 chars:', markdown.substring(0, 200));

      const updatedContent = parseContent(markdown);
      console.log('[Preview] Parsed content, trials count:', updatedContent.trialsData?.length);
      console.log('[Preview] Exec title:', updatedContent.execSummaryTitle);

      if (!updatedContent.trialsData || updatedContent.trialsData.length === 0) {
        console.error('[Preview] No trials data parsed!');
        alert('Failed to parse trials data from file');
        return;
      }

      const updatedTrials = updatedContent.trialsData.map(trial => {
        const baseTrial = baseContent.trialsData.find(t => t.id === trial.id);
        if (baseTrial && baseTrial.pts_score !== trial.pts_score) {
          console.log(`[Preview] PTS change for ${trial.trial_name}: ${baseTrial.pts_score} -> ${trial.pts_score}`);
          return {
            ...trial,
            _pts_change: {
              previous: baseTrial.pts_score,
              current: trial.pts_score,
              direction: trial.pts_score > baseTrial.pts_score ? 'up' : 'down'
            }
          };
        }
        return trial;
      });

      const changesFound = computeChanges(baseContent.trialsData, updatedTrials);
      console.log('[Preview] Changes found:', Object.keys(changesFound).length);

      const newTimestamp = new Date().toISOString();
      setCurrentContent({ ...updatedContent, trialsData: updatedTrials, lastRefreshed: newTimestamp });
      setChanges(changesFound);
      setIsBase(false);
      setLastRefreshTime(newTimestamp);
      console.log('[Preview] UI updated successfully!');
    } catch (error) {
      console.error('[Preview] Error loading claude-output.md:', error);
      alert('Error: ' + error.message);
    }
  }, [baseContent, computeChanges]);

  const value = {
    trialsData: currentContent.trialsData,
    planSections: currentContent.planSections,
    lastRefreshed: lastRefreshTime,
    changes,
    isBase,
    isRefreshing,
    refreshProgress,
    loadBase,
    refreshWithResearch,
    stopResearch,
    getExecSummary,
    loadFromClaudeOutput
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
