/* Shared scoring logic for the Thornton Watlass quoits site.
   A "match" is two teams; each match is made up of individual "games"
   (one player vs one player, playing to 21). The match winner is
   whoever wins more games (ties broken by total points if games are
   level). League points default 2/1/0. */

async function loadData() {
  const res = await fetch('data.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load data.json');
  return res.json();
}

function matchGameTally(match) {
  let homeWins = 0, awayWins = 0, homePts = 0, awayPts = 0;
  for (const g of match.games) {
    homePts += Number(g.homeScore) || 0;
    awayPts += Number(g.awayScore) || 0;
    if (g.homeScore > g.awayScore) homeWins++;
    else if (g.awayScore > g.homeScore) awayWins++;
  }
  return { homeWins, awayWins, homePts, awayPts };
}

/* Match (league) points: 1 point per game won, plus a 2-point bonus to
   whichever team scored more points in total across the match. If the
   total points are tied, neither side gets the bonus. */
function matchPoints(match) {
  const { homeWins, awayWins, homePts, awayPts } = matchGameTally(match);
  const homeBonus = homePts > awayPts ? 2 : 0;
  const awayBonus = awayPts > homePts ? 2 : 0;
  return {
    homeWins, awayWins, homePts, awayPts,
    homeMatchPoints: homeWins + homeBonus,
    awayMatchPoints: awayWins + awayBonus
  };
}

function matchResult(match) {
  const { homeMatchPoints, awayMatchPoints } = matchPoints(match);
  if (homeMatchPoints === awayMatchPoints) return 'draw';
  return homeMatchPoints > awayMatchPoints ? 'home' : 'away';
}

function computeLeagueTable(data) {
  const table = {};
  for (const t of data.teams) {
    table[t] = { team: t, played: 0, won: 0, drawn: 0, lost: 0, ptsFor: 0, ptsAgainst: 0, leaguePoints: 0 };
  }
  const leagueMatches = data.matches.filter(m => (m.type || 'league') !== 'cup');
  for (const m of leagueMatches) {
    if (!table[m.home]) table[m.home] = { team: m.home, played: 0, won: 0, drawn: 0, lost: 0, ptsFor: 0, ptsAgainst: 0, leaguePoints: 0 };
    if (!table[m.away]) table[m.away] = { team: m.away, played: 0, won: 0, drawn: 0, lost: 0, ptsFor: 0, ptsAgainst: 0, leaguePoints: 0 };
    const { homePts, awayPts, homeMatchPoints, awayMatchPoints } = matchPoints(m);
    const result = matchResult(m);
    const home = table[m.home], away = table[m.away];
    home.played++; away.played++;
    home.ptsFor += homePts; home.ptsAgainst += awayPts;
    away.ptsFor += awayPts; away.ptsAgainst += homePts;
    home.leaguePoints += homeMatchPoints;
    away.leaguePoints += awayMatchPoints;
    if (result === 'home') { home.won++; away.lost++; }
    else if (result === 'away') { away.won++; home.lost++; }
    else { home.drawn++; away.drawn++; }
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
    const { homeWins, awayWins, homePts, awayPts, homeMatchPoints, awayMatchPoints } = matchPoints(m);
    const result = matchResult(m);
    const won = (result === 'home' && isHome) || (result === 'away' && !isHome);
    const lost = (result === 'home' && !isHome) || (result === 'away' && isHome);
    const outcome = result === 'draw' ? 'draw' : won ? 'win' : 'loss';
    return {
      id: m.id, date: m.date, opponent, isHome, outcome,
      type: m.type || 'league',
      teamMatchPoints: isHome ? homeMatchPoints : awayMatchPoints,
      oppMatchPoints: isHome ? awayMatchPoints : homeMatchPoints,
      teamGames: isHome ? homeWins : awayWins,
      oppGames: isHome ? awayWins : homeWins,
      teamPts: isHome ? homePts : awayPts,
      oppPts: isHome ? awayPts : homePts,
      games: m.games, home: m.home, away: m.away
    };
  });

  // Cup games show up in the match log but don't count toward the season's league summary.
  const summary = rows.filter(r => r.type !== 'cup').reduce((s, r) => {
    s.played++;
    if (r.outcome === 'win') s.won++; else if (r.outcome === 'loss') s.lost++; else s.drawn++;
    s.ptsFor += r.teamPts; s.ptsAgainst += r.oppPts;
    return s;
  }, { played: 0, won: 0, lost: 0, drawn: 0, ptsFor: 0, ptsAgainst: 0 });

  return { rows, summary };
}

function computePlayerStats(data, teamName) {
  const players = {};
  const touch = (name) => {
    if (!players[name]) players[name] = { name, gamesPlayed: 0, gamesWon: 0, gamesLost: 0, pointsFor: 0, pointsAgainst: 0, ringers: 0 };
    return players[name];
  };
  for (const m of data.matches) {
    const isHome = m.home === teamName;
    const isAway = m.away === teamName;
    if (!isHome && !isAway) continue;
    for (const g of m.games) {
      const rawName = isHome ? g.homePlayer : g.awayPlayer;
      const name = (rawName || '').trim();
      if (!name) continue;
      const ourScore = isHome ? g.homeScore : g.awayScore;
      const theirScore = isHome ? g.awayScore : g.homeScore;
      const ourRingers = Number((isHome ? g.homeRingers : g.awayRingers)) || 0;
      const p = touch(name);
      p.gamesPlayed++;
      p.pointsFor += Number(ourScore) || 0;
      p.pointsAgainst += Number(theirScore) || 0;
      p.ringers += ourRingers;
      if (ourScore > theirScore) p.gamesWon++;
      else if (theirScore > ourScore) p.gamesLost++;
    }
  }
  return Object.values(players).sort((a, b) => b.gamesWon - a.gamesWon || b.gamesPlayed - a.gamesPlayed);
}
