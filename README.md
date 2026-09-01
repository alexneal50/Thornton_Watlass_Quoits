# Thornton Watlass Quoits &mdash; League Site

A free website tracking the North Yorkshire quoits league table and
Thornton Watlass's own season stats, with login-protected access. No
server to maintain, no monthly cost &mdash; static files on GitHub Pages,
plus Google's free Firebase Authentication for accounts and password
resets.

## What's in here

- `index.html` &mdash; league table, current Thornton Watlass standing, recent results
- `team.html` &mdash; Thornton Watlass match log and player/pairing stats
- `admin.html` &mdash; a form for entering match scores
- `login.html` &mdash; sign in, create an account, or reset a forgotten password
- `data.json` &mdash; all the season's data lives here (teams and match scores)
- `style.css`, `stats.js` &mdash; styling and the stats calculations
- `auth.js`, `firebase-config.js` &mdash; the login system; `firebase-config.js` is
  where you paste your own free Firebase project's keys (step 2 below)

The league table and team page are open to anyone with the link. Only
`admin.html` (entering scores) requires signing in &mdash; it'll bounce you
to `login.html` if you're not.

## One-time setup

### Step 1: Set up the free login system (Firebase)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   and sign in with any Google account. Click **Add project**, name it
   e.g. `thornton-watlass-quoits`, and finish creation (you can decline
   Google Analytics &mdash; not needed).
2. In the left sidebar, click **Build → Authentication**, then **Get started**.
3. Under **Sign-in method**, click **Email/Password**, toggle it **Enabled**,
   and save.
4. Click the gear icon → **Project settings**. Scroll to "Your apps", click
   the **</>** (web) icon, give it any nickname, and click **Register app**.
   It'll show a `firebaseConfig` object with your keys.
5. Open `firebase-config.js` in this project and paste your values in,
   replacing the placeholders. This file is safe to be public &mdash; it's an
   identifier, not a secret.
6. By default, anyone who visits `login.html` can create their own account
   via "Create account" &mdash; fine for a small trusted team. If you'd rather
   control who joins, in the Firebase console under **Authentication →
   Users** you can add people's emails yourself and remove the option to
   self-register (ask me if you want that tightened up).

### Step 2: publish on GitHub Pages (free)

1. Go to [github.com](https://github.com) and create a free account if you
   don't have one.
2. Click the **+** in the top right → **New repository**. Name it something
   like `thornton-watlass-quoits`. Set it to **Public**. Click **Create repository**.
3. On the new repo's page, click **Add file → Upload files**, then drag in
   every file from this project, including your edited `firebase-config.js`.
   Click **Commit changes**.
4. Go to **Settings → Pages** (left sidebar). Under "Build and deployment",
   set **Source** to **Deploy from a branch**, branch **main**, folder **/(root)**. Click **Save**.
5. Wait a minute, then refresh that Pages settings screen &mdash; it will show
   your live URL, something like:
   `https://yourusername.github.io/thornton-watlass-quoits/`
6. Share that link with your team. They'll land on the sign-in page first
   &mdash; each person creates their own account with their email and a
   password, or you add them from the Firebase console.

## Entering scores each week

1. Open your site's `admin.html` page (e.g.
   `.../thornton-watlass-quoits/admin.html`).
2. Fill in the date, pick home/away teams (add a new team if needed), and
   enter each rink's pairing and score.
3. Click **Save match to this page**, add more matches if you have several
   to enter, then click **Download updated data.json**.
4. On GitHub.com, open your repo, click into `data.json`, click the pencil
   (edit) icon, select all and delete, then paste in the contents of the
   file you just downloaded (or use **Add file → Upload files** and let it
   replace `data.json`). Click **Commit changes**.
5. The live site updates automatically within a minute or two.

Only one person needs to do steps 3&ndash;4 after a match &mdash; everyone
else just visits the site to look.

## Adjusting things later

- **League points system**: edit `pointsForWin` / `pointsForDraw` /
  `pointsForLoss` at the top of `data.json` (defaults to 2/1/0).
- **Season name**: edit the `season` field in `data.json`.
- **Team names**: add teams via the admin page, or edit the `teams` array
  in `data.json` directly.
- If your actual scoring format is different from "several 21-up rinks per
  match" (e.g. a different number of ends, or singles rather than pairs),
  let me know the exact format and I can adjust the scoring logic in
  `stats.js`.

## Notes

- **Who needs an account**: nobody, to just look at the site. Only
  entering or editing scores on `admin.html` requires signing in. Anyone
  can view the league table and Thornton Watlass's stats via the plain link.
- **Login system**: Firebase Authentication's free tier covers far more
  users than a village quoits team will ever need. There's no separate
  admin role &mdash; anyone with an account can add matches. Say if you'd
  like a further distinction between account types.
- **Forgotten passwords**: "Forgot password?" on the sign-in page sends a
  reset email straight from Firebase, with a link to a Firebase-hosted
  page for setting a new password &mdash; no extra setup needed.
- **Data still isn't live-multiplayer**: entering scores still works the
  way described above &mdash; download the updated `data.json` from
  `admin.html` and replace it in the GitHub repo. The login system controls
  *who can reach that page*, not how the data gets published. If you'd
  like scores to save straight from the admin page with no GitHub step,
  that's a further step up (a small database) &mdash; ask if you want that.
- Works fine on phones for viewing and signing in; entering scores is
  easiest on a laptop since you're copying a downloaded file into GitHub.
