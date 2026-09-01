import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/** Resolves with the signed-in user, or redirects to login.html and never resolves. */
export function guardPage() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        const next = encodeURIComponent(location.pathname.split('/').pop() || 'index.html');
        window.location.href = `login.html?next=${next}`;
      } else {
        resolve(user);
      }
    });
  });
}

export function wireUserChip(user) {
  const chip = document.getElementById('user-chip');
  if (!chip) return;
  chip.innerHTML = `<span>${user.email}</span><button id="sign-out-btn" class="secondary">Sign out</button>`;
  document.getElementById('sign-out-btn').addEventListener('click', async () => {
    await signOut(auth);
    window.location.reload();
  });
}

/** For public pages: shows a "Sign in" link if signed out, or the user chip if signed in. Never redirects. */
export function watchAuthStatus() {
  onAuthStateChanged(auth, (user) => {
    const chip = document.getElementById('user-chip');
    if (!chip) return;
    if (user) {
      wireUserChip(user);
    } else {
      const next = encodeURIComponent(location.pathname.split('/').pop() || 'index.html');
      chip.innerHTML = `<a href="login.html?next=${next}" class="btn secondary" style="text-decoration:none;">Sign in</a>`;
    }
  });
}

export function revealPage() {
  const loading = document.getElementById('auth-loading');
  if (loading) loading.style.display = 'none';
  document.querySelectorAll('.auth-protected').forEach(el => el.style.display = '');
}
