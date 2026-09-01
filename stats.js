/* Shared scoring logic for the Thornton Watlass quoits site.
   A "match" is two teams; each match is made up of "rinks" (pairs playing
   to 21). The match winner is whoever wins more rinks (ties broken by
   total points if rinks are level). League points default 2/1/0. */

async function loadData() {
  const res = await fetch('data.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load data.json');
  return res.json();
}

function matchRinkTally(match) {
  let homeRinks = 0, awayRinks = 0, homePts = 0, awayPts = 0;
  for (const r of match.rinks) {
    homePts += Number(r.homeScore) || 0;
    awayPts += Number(r.awayScore) || 0;
    if (r.homeScore > r.awayScore) homeRinks++;
    else if (r.awayScore > r.homeScore) awayRinks++;
  }
  return { homeRinks, awayRinks, homePts, awayPts };
}

function matchResult(match) {
  const { homeRinks, awayRinks, homePts, awayPts } = matchRinkTally(match);
  if (homeRinks === awayRinks) {
    if (homePts === awayPts) return 'draw';
    return homePts > awayPts ? 'home' : 'away';
  }
  return homeRinks > awayRinks ? 'home' : 'away';
}

function computeLeagueTable(data) {
  const table = {};
  for (const t of data.teams) {
    table[t] = { team: t, played: 0, won: 0, drawn: 0, lost: 0, ptsFor: 0, ptsAgainst: 0, leaguePoints: 0 };
  }
  for (const m of data.matches) {
    if (!table[m.home]) table[m.home] = { team: m.home, played: 0, won: 0, drawn: 0, lost: 0, ptsFor: 0, ptsAgainst: 0, leaguePoints: 0 };
    if (!table[m.away]) table[m.away] = { team: m.away, played: 0, won: 0, drawn: 0, lost: 0, ptsFor: 0, ptsAgainst: 0, leaguePoints: 0 };
    const { homePts, awayPts } = matchRinkTally(m);
    const result = matchResult(m);
    const home = table[m.home], away = table[m.away];
    home.played++; away.played++;
    home.ptsFor += homePts; home.ptsAgainst += awayPts;
    away.ptsFor += awayPts; away.ptsAgainst += homePts;
    const win = data.pointsForWin ?? 2, draw = data.pointsForDraw ?? 1, loss = data.pointsForLoss ?? 0;
    if (result === 'home') { home.won++; away.lost++; home.leaguePoints += win; away.leaguePoints += loss; }
    else if (result === 'away') { away.won++; home.lost++; away.leaguePoints += win; home.leaguePoints += loss; }
    else { home.drawn++; away.drawn++; home.leaguePoints += draw; away.leaguePoints += draw; }
  }
  return Object.values(table).sort((a, b) =>
    b.leaguePoints - a.leaguePoints || (b.ptsFor - b.ptsAgainst) - (a.ptsFor - a.ptsAgainst)
  );
}

function computeTeamStats(data, teamName) {
  const relevant = data.matches
    .filter(m => m.home === teamName || m.away === teamName)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const rows = relevant.map(m => {
    const isHome = m.home === teamName;
    const opponent = isHome ? m.away : m.home;
    const { homeRinks, awayRinks, homePts, awayPts } = matchRinkTally(m);
    const result = matchResult(m);
    const won = (result === 'home' && isHome) || (result === 'away' && !isHome);
    const lost = (result === 'home' && !isHome) || (result === 'away' && isHome);
    const outcome = result === 'draw' ? 'draw' : won ? 'win' : 'loss';
    return {
      id: m.id, date: m.date, opponent, isHome, outcome,
      teamRinks: isHome ? homeRinks : awayRinks,
      oppRinks: isHome ? awayRinks : homeRinks,
      teamPts: isHome ? homePts : awayPts,
      oppPts: isHome ? awayPts : homePts,
      rinks: m.rinks, home: m.home, away: m.away
    };
  });

  const summary = rows.reduce((s, r) => {
    s.played++;
    if (r.outcome === 'win') s.won++; else if (r.outcome === 'loss') s.lost++; else s.drawn++;
    s.ptsFor += r.teamPts; s.ptsAgainst += r.oppPts;
    return s;
  }, { played: 0, won: 0, lost: 0, drawn: 0, ptsFor: 0, ptsAgainst: 0 });

  return { rows, summary };
}

function splitPlayers(str) {
  return (str || '').split('&').map(s => s.trim()).filter(Boolean);
}

function computePlayerStats(data, teamName) {
  const players = {};
  const touch = (name) => {
    if (!players[name]) players[name] = { name, rinksPlayed: 0, rinksWon: 0, rinksLost: 0, pointsFor: 0, pointsAgainst: 0 };
    return players[name];
  };
  for (const m of data.matches) {
    const isHome = m.home === teamName;
    const isAway = m.away === teamName;
    if (!isHome && !isAway) continue;
    for (const r of m.rinks) {
      const ourPlayers = splitPlayers(isHome ? r.homePlayers : r.awayPlayers);
      const ourScore = isHome ? r.homeScore : r.awayScore;
      const theirScore = isHome ? r.awayScore : r.homeScore;
      for (const name of ourPlayers) {
        const p = touch(name);
        p.rinksPlayed++;
        p.pointsFor += Number(ourScore) || 0;
        p.pointsAgainst += Number(theirScore) || 0;
        if (ourScore > theirScore) p.rinksWon++;
        else if (theirScore > ourScore) p.rinksLost++;
      }
    }
  }
  return Object.values(players).sort((a, b) => b.rinksWon - a.rinksWon || b.rinksPlayed - a.rinksPlayed);
}
