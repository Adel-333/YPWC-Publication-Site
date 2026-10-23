/**
 * YPWC Minimal Email Dispatcher (Google Apps Script)
 * Youth Physics Writing Contest - October STEM School
 * 
 * Strict specifications:
 * - No em-dashes
 * - No feedback or review text
 * - No score breakdown
 * - Certificates strictly for Top 10
 */

const YPWC_CONFIG = {
  SENDER_NAME: "Physics Club",
  LEADERBOARD_URL: "https://ypwc.octoberstem.org/leaderboard"
};

function getMedalColor(medal) {
  var m = String(medal || "").toLowerCase();
  if (m.indexOf("gold") !== -1) return "#FFD700";
  if (m.indexOf("silver") !== -1) return "#C0C0C0";
  if (m.indexOf("bronze") !== -1) return "#CD7F32";
  return "#5C9EFF";
}

/**
 * Send Winner Email (Top 10 Only)
 */
function sendWinnerEmail(participant, templateHtml, inlineImages) {
  var subject = "Youth Physics Writing Contest - Top 10 Result";
  
  var medalColor = getMedalColor(participant.medal);
  var html = templateHtml
    .replace(/\{\{PARTICIPANT_NAME\}\}/g, participant.name)
    .replace(/\{\{RANK\}\}/g, participant.rank)
    .replace(/\{\{MEDAL\}\}/g, participant.medal || "Finalist")
    .replace(/\{\{MEDAL_COLOR\}\}/g, medalColor)
    .replace(/\{\{ARTICLE_TITLE\}\}/g, participant.title || "")
    .replace(/\{\{CERTIFICATE_URL\}\}/g, participant.certificateUrl || "#")
    .replace(/\{\{LEADERBOARD_URL\}\}/g, YPWC_CONFIG.LEADERBOARD_URL);

  GmailApp.sendEmail(participant.email, subject, "Please view this message in an HTML-compatible client.", {
    name: YPWC_CONFIG.SENDER_NAME,
    htmlBody: html,
    inlineImages: inlineImages || {}
  });
}

/**
 * Send Non-Winner Email (No Certificate, Straightforward acknowledgement)
 */
function sendNonWinnerEmail(participant, templateHtml, inlineImages) {
  var subject = "Youth Physics Writing Contest - Submission Status";
  
  var html = templateHtml
    .replace(/\{\{PARTICIPANT_NAME\}\}/g, participant.name)
    .replace(/\{\{ARTICLE_TITLE\}\}/g, participant.title || "")
    .replace(/\{\{LEADERBOARD_URL\}\}/g, YPWC_CONFIG.LEADERBOARD_URL);

  GmailApp.sendEmail(participant.email, subject, "Please view this message in an HTML-compatible client.", {
    name: YPWC_CONFIG.SENDER_NAME,
    htmlBody: html,
    inlineImages: inlineImages || {}
  });
}
