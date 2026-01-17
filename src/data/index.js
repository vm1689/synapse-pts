// Synapse - PTS Tracker Data and Design Tokens
import contentMd from './content.md?raw';
import { parseContent, formatExecSummary } from './parseContent';

// Design tokens
export const ACCENT = '#7B61FF';
export const accentBg = { backgroundColor: ACCENT };

// Typography scale - consistent sizing across the app
export const type = {
  pageTitle: { fontSize: '16px', lineHeight: '22px' },
  sectionTitle: { fontSize: '14px', lineHeight: '20px' },
  label: { fontSize: '13px', lineHeight: '18px' },
  body: { fontSize: '13px', lineHeight: '20px' },
  small: { fontSize: '12px', lineHeight: '16px' },
  caption: { fontSize: '11px', lineHeight: '14px' },
  badge: { fontSize: '11px', lineHeight: '14px' },
  metric: { fontSize: '24px', lineHeight: '28px' },
};

// Parse content from markdown
const content = parseContent(contentMd);

// Export parsed data
export const planSections = content.planSections;
export const trialsData = content.trialsData;
export const lastRefreshed = content.lastRefreshed;

// Export exec summary helpers
export const getExecSummary = () => formatExecSummary(
  content.execSummaryTemplate,
  content.execSummaryTitle,
  content.trialsData
);

// PTS Alerts data (kept in JS for now, can be moved to markdown later)
export const ptsAlertsData = [
  {
    id: 1,
    date: 'Jan 14',
    type: 'PTS Drop',
    severity: 'High',
    headline: 'CLARITY-2B: PTS dropped 12 points to 28% - steering committee review required',
    trial_id: 2,
    content: [
      'CLARITY-2B PTS declined from 40% to 28% over the past 30 days, triggering high-severity alert threshold.',
      'Primary drivers: (1) Enrollment now 46% behind target with site activation delays in EU; (2) Competitor Lecanemab\'s confirmatory data showed stronger-than-expected effect on CDR-SB; (3) Internal biomarker analysis showing higher variability than projected.',
      'Recommend: Steering committee review within 5 business days. Consider protocol amendment for enrichment strategy or enrollment timeline extension.'
    ],
    source: 'PTS Monitoring System',
    sourceDate: 'January 14, 2026',
    sourceUrl: 'internal://pts-dashboard/clarity-2b'
  },
  {
    id: 2,
    date: 'Jan 13',
    type: 'Safety Signal',
    severity: 'High',
    headline: 'LIVER-SHIELD: Elevated LFTs in 3 patients - DSMB review scheduled',
    trial_id: 5,
    content: [
      'Three patients in the high-dose arm reported ALT elevations >5x ULN. DSMB emergency meeting scheduled for January 16.',
      'Current PTS impact: -8 points over 30 days (48% → 32%). Additional decline expected pending DSMB outcome.',
      'Comparable events observed in FXR class; dose modification may be required. Enrollment in high-dose arm temporarily paused.'
    ],
    source: 'Safety Monitoring',
    sourceDate: 'January 13, 2026',
    sourceUrl: 'internal://safety/liver-shield'
  },
  {
    id: 3,
    date: 'Jan 12',
    type: 'Phase Transition',
    severity: 'Medium',
    headline: 'ELEVATE-1: Phase 3 interim analysis positive - PTS increased to 62%',
    trial_id: 1,
    content: [
      'Independent DMC completed interim efficacy analysis. Trial continuing as planned with no modifications recommended.',
      'PTS increased from 55% baseline to 62% (+7 points) following positive interim signal.',
      'Competitor KRAS G12C inhibitor (Mirati) readout expected Q2 2026 - monitoring for potential PTS impact.'
    ],
    source: 'DMC Report',
    sourceDate: 'January 12, 2026',
    sourceUrl: 'internal://dmc/elevate-1'
  },
  {
    id: 4,
    date: 'Jan 10',
    type: 'Competitive Event',
    severity: 'Medium',
    headline: 'Competitor tau antibody reports negative Phase 3 - CLARITY-2B PTS unaffected',
    trial_id: 2,
    content: [
      'Biogen announced discontinuation of BIIB080 antisense program for Alzheimer\'s following negative Phase 2 results.',
      'Different mechanism (antisense vs antibody) limits direct read-through to CLARITY-2B.',
      'However, increases regulatory scrutiny on tau-targeting approaches. No PTS adjustment at this time but monitoring closely.'
    ],
    source: 'Competitive Intelligence',
    sourceDate: 'January 10, 2026',
    sourceUrl: 'internal://competitive/cns'
  },
  {
    id: 5,
    date: 'Jan 8',
    type: 'Regulatory Update',
    severity: 'Low',
    headline: 'FDA Type B meeting positive for VISION-3 - accelerated pathway confirmed',
    trial_id: 4,
    content: [
      'FDA confirmed acceptance of BCVA change as primary endpoint for accelerated approval pathway.',
      'Agency agreed single pivotal trial may be sufficient given unmet need and robust Phase 2 data.',
      'PTS increased from 72% to 78% (+6 points). On track for Q1 2026 readout and potential NDA submission Q3 2026.'
    ],
    source: 'Regulatory Affairs',
    sourceDate: 'January 8, 2026',
    sourceUrl: 'internal://regulatory/vision-3'
  },
  {
    id: 6,
    date: 'Jan 5',
    type: 'Enrollment Milestone',
    severity: 'Low',
    headline: 'HEART-STRONG: 90% enrollment achieved - ahead of schedule',
    trial_id: 3,
    content: [
      'HEART-STRONG reached 1,850 of 2,000 target patients (92.5%), 6 weeks ahead of projected timeline.',
      'Strong site performance in US and Japan. Last patient expected by end of January 2026.',
      'PTS stable at 71% with positive trajectory. Primary endpoint readout on track for Q2 2026.'
    ],
    source: 'Clinical Operations',
    sourceDate: 'January 5, 2026',
    sourceUrl: 'internal://enrollment/heart-strong'
  },
];
