# Thornton Watlass Quoits &mdash; League Site

A free website tracking the North Yorkshire quoits league table and
Thornton Watlass's own season stats, with login-protected access. No
server to maintain, no monthly cost &mdash; static files on GitHub Pages,
plus Google's free Firebase Authentication for accounts and password
resets.

## What's in here

- `index.html` &mdash; league table, Next Match countdown, current standing, recent results
- `team.html` &mdash; Thornton Watlass player stats (All Games, League, Cup, Captains Cup)
- `results.html` &mdash; every Thornton Watlass result, with a season filter
- `fixtures.html` &mdash; matches still to be played
- `cup.html` &mdash; the Cup knockout bracket, round by round
- `admin.html` &mdash; a form for entering match scores and fixtures
- `login.html` &mdash; sign in, create an account, or reset a forgotten password
- `data.json` &mdash; all the season's data lives here (teams, matches, and fixtures)
- `style.css`, `stats.js` &mdash; styling and the stats calculations
- `auth.js`, `firebase-config.js` &mdash; the login system; `firebase-config.js` is
  where you paste your own free Firebase project's keys (step 2 below)
- `quoit.svg` &mdash; the metal quoit graphic shown at the top of each page

The league table and team pages are open to anyone with the link. Only
`admin.html` (entering scores and fixtures) requires signing in &mdash; it'll
bounce you to `login.html` if you're not.

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
   enter each game's player names, points, and ringers.
3. Click **Save match to this page**, add more matches if you have several
   to enter, then click **Download updated data.json**.
4. On GitHub.com, open your repo, click into `data.json`, click the pencil
   (edit) icon, select all and delete, then paste in the contents of the
   file you just downloaded (or use **Add file → Upload files** and let it
   replace `data.json`). Click **Commit changes**.
5. The live site updates automatically within a minute or two.

Only one person needs to do steps 3&ndash;4 after a match &mdash; everyone
else just visits the site to look.

## League vs cup vs Captains Games

Every match is tagged when you enter it (defaults to League):

- **League**: counts everywhere &mdash; player stats, the main league table,
  and the season summary.
- **Cup**: counts toward player stats and shows on the dedicated **Cup**
  page as a knockout bracket, but never touches the league table or season
  summary. When you enter a Cup match, pick which round it's in (Round 1,
  Round 2, Round 3, Quarter-Final, Semi-Final, or Final) &mdash; the Cup page
  groups matches into columns by round, in that order, and highlights
  whichever team won each tie. Pick **Final** for the last match and it's
  marked with a gold border and a FINAL badge automatically.
- **Captains Cup**: a single-game fixture (the form only asks for one game
  when this is selected). These build their **own separate Captains League
  table**, shown on the League page below the main table &mdash; they never
  affect Thornton Watlass's league position or the season summary.

Cup and Captains Cup matches still show up on the Results page and in
"Recent results" on the League page, each with a badge, so nothing's hidden
&mdash; they just don't feed into the main league numbers.

The **Our Team** page shows player stats in four tables: **All Games**,
**League**, **Cup**, and **Captains Cup**. The **Results** page has the
full match-by-match log (with a season dropdown to filter by year), and
the **Cup** page has the knockout bracket.

## How league points work (main league and Captains League)

Each team earns **1 league point for every game they win** in a match, plus
a **2-point bonus** for whichever team scores more points in total across
the whole match. If the total points are level, neither side gets the
bonus. The same scoring applies to the Captains League, just with one game
per match instead of several.

For example: Team A wins 4 individual games, Team B wins 3 &mdash; but Team
B's players scored more points in total across the match. Team A gets 4
league points (4 games, no bonus). Team B gets 3 + 2 = 5 league points. The
match is recorded as a 4&ndash;5 win for Team B, even though Team A won more
individual games.

Both tables rank teams by total league points across the season, then by
points difference.

## Divisions

Every team is tagged **1st Division** or **2nd Division** on the Enter
Scores page, under "Teams & divisions". The main league table only shows
teams in Thornton Watlass's own division &mdash; teams from the other
division still need to be added there so they're available to select for
cup and Captains Games fixtures, they just won't appear in the main table.
The Captains League isn't restricted by division, since captains games can
be played against any club.

## Seasons

Every page that shows stats (League, Our Team, Cup, Results, Fixtures) has a
**Season** dropdown, worked out automatically from the years in your match
and fixture dates &mdash; there's nothing to configure. Picking a season on
one page remembers your choice on the others, on the same device.

**To start a new season**, just add a fixture dated in the new year on the
Enter Scores page &mdash; that year then appears as a new option in every
Season dropdown across the site.

## Fixtures and the Next Match countdown

The **Fixtures** page lists matches still to be played. Add them on the
Enter Scores page, under "Fixtures" &mdash; date, an optional kick-off time,
match type (and round, for Cup), teams, and an optional venue (defaults to
the home team's name if left blank).

The League page shows a **Next Match** box at the top with a live countdown,
built from whichever of Thornton Watlass's fixtures is soonest. Once that
match's date and time have passed, it's automatically replaced by the next
one &mdash; no need to remove anything by hand, though you should still enter
the actual score afterwards so it shows up in Results.

When entering a match's score on the Enter Scores page, you can pick
**"Load from a fixture"** at the top of the form to pull in the date, teams,
and type automatically &mdash; once you save the match, that fixture is
removed from the upcoming list.

## Player name suggestions

When you type a Thornton Watlass player's name into a game row, previously
used names suggest automatically (only for Thornton Watlass &mdash; opponents'
names are always free text, since there's no reason to remember every other
club's players). This helps keep the same player's stats together rather
than "J. Metcalfe" and "J Metcalfe" being tracked as two different people.

## Form guides

The League table (both the main table and the Captains League) and every
player stats table show a strip of coloured circles for the last 5 results
&mdash; green for a win, red for a loss, amber for a draw, oldest on the
left. Team form is worked out from whichever competition that table covers
(League games for the main table, Captains Games for the Captains League);
player form uses whichever of the four Our Team tables it sits in.

## Adjusting things later

- **Season name**: edit the `season` field in `data.json`.
- **Team names**: add teams via the admin page, or edit the `teams` array
  in `data.json` directly.
- If your actual scoring format is different from "singles games to 21,
  1 league point per game won plus a 2-point bonus for the higher points
  total", let me know and I can adjust the scoring logic in `stats.js`.

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
- **If a match you entered doesn't show up on the site**: the Enter Scores
  page now has a live "Copy data.json" box that always reflects exactly
  what's currently saved to the page &mdash; check your entries are really
  there before publishing. The Download button can be unreliable on some
  phone browsers (it can navigate away from the page instead of
  downloading, which looks like your entries vanished) &mdash; if that
  happens, use **Copy to clipboard** in that box instead and paste
  directly into `data.json` on GitHub. Download also now saves whatever's
  in the form automatically first, so nothing's lost if you forget to
  click "Save match to this page".
