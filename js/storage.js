// Saves the garden in this browser's localStorage, plus JSON export and import.
// localStorage is per address, so always open the app at http://localhost:8437.

import { emptyGarden, validateGarden } from './garden.js';

const KEY = 'micro-habit-garden';

export function loadGarden() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return emptyGarden();
  try {
    return validateGarden(JSON.parse(raw));
  } catch (err) {
    // Keep the unreadable copy so a bad save never silently wipes history.
    localStorage.setItem(`${KEY}-unreadable-${Date.now()}`, raw);
    console.error('Saved garden was unreadable. A copy was kept in localStorage.', err);
    return emptyGarden();
  }
}

export function saveGarden(garden) {
  localStorage.setItem(KEY, JSON.stringify(garden));
}

export function downloadBackup(garden, today) {
  const blob = new Blob([JSON.stringify(garden, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `micro-habit-garden-${today}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function readBackup(file) {
  return validateGarden(JSON.parse(await file.text()));
}
