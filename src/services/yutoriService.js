// Yutori Browsing API Service
const YUTORI_API_KEY = import.meta.env.VITE_YUTORI_API_KEY;
const YUTORI_API_URL = 'https://api.yutori.com/v1/browsing/tasks';
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 60;
const MAX_STEPS = 20;

let abortController = null;

// Save to debug folder
async function saveDebug(filename, content) {
  const response = await fetch('/api/save-debug', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, content })
  });
  return response.json();
}

// Read from debug folder
async function readDebug(filename) {
  const response = await fetch(`/api/read-debug?filename=${filename}`);
  if (!response.ok) return null;
  return response.text();
}

// Poll for task completion
async function pollTask(taskId, signal, onProgress) {
  const url = `${YUTORI_API_URL}/${taskId}`;

  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    if (signal?.aborted) throw new Error('Cancelled');

    onProgress?.(`Browsing... (${i * 2}s)`);

    const response = await fetch(url, {
      headers: { 'X-API-Key': YUTORI_API_KEY },
      signal
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Yutori] Poll failed: ${response.status}`, errText);
      throw new Error(`Poll failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Yutori] Poll ${i + 1}: status=${data.status}, paused=${data.paused}`);

    // Accept "succeeded", "failed", or paused with results as completion
    if (data.status === 'succeeded' || data.status === 'failed' || data.paused) {
      console.log('[Yutori] Task complete, result length:', data.result?.length || 0);
      return data;
    }

    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, POLL_INTERVAL_MS);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('Cancelled'));
      }, { once: true });
    });
  }

  throw new Error('Timeout');
}

// Main function: research trials and save to file
export async function researchTrials(trials, onProgress) {
  abortController = new AbortController();
  const signal = abortController.signal;

  const trialNames = trials.map(t => t.trial_name).join(', ');
  const task = `Search Google News for recent news (last 60 days) about these clinical trials: ${trialNames}. For each trial with news, provide: trial name, headline, date, and one-sentence summary. Skip trials with no recent news.`;

  onProgress?.('Starting Yutori...');
  console.log('[Yutori] Task:', task);

  try {
    const createResponse = await fetch(YUTORI_API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': YUTORI_API_KEY,
        'Content-Type': 'application/json'
      },
      signal,
      body: JSON.stringify({
        task,
        start_url: 'https://news.google.com',
        max_steps: MAX_STEPS
      })
    });

    if (!createResponse.ok) {
      const err = await createResponse.text();
      throw new Error(`Create failed: ${createResponse.status} - ${err}`);
    }

    const taskData = await createResponse.json();
    console.log('[Yutori] Task created:', taskData.task_id);
    onProgress?.(`Task: ${taskData.task_id}`);

    const result = await pollTask(taskData.task_id, signal, onProgress);

    // Save to yutori-output.md - THIS IS THE SOURCE OF TRUTH
    const outputContent = `# Yutori Research Output

**Task ID:** ${taskData.task_id}
**View URL:** ${taskData.view_url}
**Status:** ${result.status}
**Time:** ${new Date().toISOString()}

## Research Findings

${result.result || 'No results found'}
`;

    await saveDebug('yutori-output.md', outputContent);
    console.log('[Yutori] Saved to yutori-output.md');
    onProgress?.('Yutori complete');

    abortController = null;

    return {
      success: result.status === 'succeeded',
      taskId: taskData.task_id,
      viewUrl: taskData.view_url,
      result: result.result
    };

  } catch (error) {
    abortController = null;
    if (error.message === 'Cancelled') {
      onProgress?.('Cancelled');
      return { success: false, cancelled: true };
    }
    console.error('[Yutori] Error:', error);
    onProgress?.(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

export function abortResearch() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

export default { researchTrials, abortResearch };
