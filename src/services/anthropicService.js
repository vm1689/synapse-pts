// Claude Opus API Service
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

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

// Read Yutori output from file and merge with base markdown
export async function mergeResearch(baseMarkdown, onProgress) {
  onProgress?.('Reading Yutori output...');

  // Read the Yutori output file
  const yutoriOutput = await readDebug('yutori-output.md');
  if (!yutoriOutput) {
    throw new Error('No Yutori output file found');
  }

  console.log('[Claude] Read yutori-output.md, length:', yutoriOutput.length);

  // Save the prompt for debugging
  const prompt = `You are an expert biotech/pharma analyst. Update this clinical trial markdown with the research findings.

INSTRUCTIONS:
1. For each trial mentioned in the research, update relevant fields (efficacy_data, safety_data, competitive_landscape, fda_designations)
2. Add [UPDATE: ...] tags to mark ALL new information
3. Adjust pts_score: positive news +2-5 points, negative news -2-5 points (keep within 0-100)
4. Keep all original data - only append new info
5. UPDATE the Executive Summary section to reflect the key changes
6. UPDATE the Executive Summary title if there are significant findings
7. Return the complete updated markdown file with all sections

RESEARCH FINDINGS (from Yutori):
${yutoriOutput}

BASE MARKDOWN:
${baseMarkdown}

Return ONLY the complete updated markdown file:`;

  await saveDebug('claude-prompt.md', prompt);
  console.log('[Claude] Saved claude-prompt.md');

  onProgress?.('Calling Claude Opus 4.5...');

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    console.log('[Claude] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Claude] API error:', errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Claude] Success, tokens:', data.usage?.input_tokens, 'in,', data.usage?.output_tokens, 'out');

    const updatedMarkdown = data.content[0].text;

    // Save the FULL output - this is what the app will use
    await saveDebug('claude-output.md', updatedMarkdown);
    console.log('[Claude] Saved claude-output.md');

    onProgress?.('Claude complete');
    return updatedMarkdown;

  } catch (error) {
    console.error('[Claude] Error:', error);
    throw error;
  }
}

// Read the Claude output file
export async function readClaudeOutput() {
  return readDebug('claude-output.md');
}

// Generate timestamped filename
export function generateFilename() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `content.${ts}.md`;
}

// Save and download content
export function saveContent(markdown, filename) {
  localStorage.setItem('synapse_current_content', markdown);

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('[Claude] Downloaded:', filename);
}

export default { mergeResearch, readClaudeOutput, generateFilename, saveContent };
