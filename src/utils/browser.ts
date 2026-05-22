/**
 * Browser capability detection utilities.
 *
 * Phase 3 note: Web Speech API has no Firefox support (permanently removed
 * from their roadmap). Chrome, Edge, and Safari (iOS 14.5+) are supported.
 * Always gate microphone features behind supportsWebSpeech().
 */

/** Returns true if the browser supports the Web Speech API. */
export function supportsWebSpeech(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
}
