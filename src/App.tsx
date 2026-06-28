import { useEffect, useState } from 'react'
import './App.css'

type Team = {
  id: string
  name: string
  code: string
  flag: string
}

type MatchSeed = {
  id: number
  date: string
  venue: string
  home: Team
  away: Team
}

type Match = {
  id: number
  round: RoundKey
  label: string
  date?: string
  venue?: string
  home?: Team
  away?: Team
}

type RoundKey = 'r32' | 'r16' | 'qf' | 'sf' | 'final'
type Scores = Record<number, { home: string; away: string }>
type Winners = Record<number, string>

const roundTitles: Record<RoundKey, string> = {
  r32: '16 avos',
  r16: 'Oitavas',
  qf: 'Quartas',
  sf: 'Semifinais',
  final: 'Final',
}

const flag = (code: string) => `https://flagcdn.com/w40/${code}.png`

const teams: Record<string, Team> = {
  rsa: { id: 'rsa', name: 'South Africa', code: 'RSA', flag: flag('za') },
  can: { id: 'can', name: 'Canada', code: 'CAN', flag: flag('ca') },
  bra: { id: 'bra', name: 'Brazil', code: 'BRA', flag: flag('br') },
  jpn: { id: 'jpn', name: 'Japan', code: 'JPN', flag: flag('jp') },
  ger: { id: 'ger', name: 'Germany', code: 'GER', flag: flag('de') },
  par: { id: 'par', name: 'Paraguay', code: 'PAR', flag: flag('py') },
  ned: { id: 'ned', name: 'Netherlands', code: 'NED', flag: flag('nl') },
  mar: { id: 'mar', name: 'Morocco', code: 'MAR', flag: flag('ma') },
  civ: { id: 'civ', name: 'Ivory Coast', code: 'CIV', flag: flag('ci') },
  nor: { id: 'nor', name: 'Norway', code: 'NOR', flag: flag('no') },
  fra: { id: 'fra', name: 'France', code: 'FRA', flag: flag('fr') },
  swe: { id: 'swe', name: 'Sweden', code: 'SWE', flag: flag('se') },
  mex: { id: 'mex', name: 'Mexico', code: 'MEX', flag: flag('mx') },
  ecu: { id: 'ecu', name: 'Ecuador', code: 'ECU', flag: flag('ec') },
  eng: { id: 'eng', name: 'England', code: 'ENG', flag: flag('gb-eng') },
  cod: { id: 'cod', name: 'DR Congo', code: 'COD', flag: flag('cd') },
  bel: { id: 'bel', name: 'Belgium', code: 'BEL', flag: flag('be') },
  sen: { id: 'sen', name: 'Senegal', code: 'SEN', flag: flag('sn') },
  usa: { id: 'usa', name: 'United States', code: 'USA', flag: flag('us') },
  bih: { id: 'bih', name: 'Bosnia and Herzegovina', code: 'BIH', flag: flag('ba') },
  esp: { id: 'esp', name: 'Spain', code: 'ESP', flag: flag('es') },
  aut: { id: 'aut', name: 'Austria', code: 'AUT', flag: flag('at') },
  por: { id: 'por', name: 'Portugal', code: 'POR', flag: flag('pt') },
  cro: { id: 'cro', name: 'Croatia', code: 'CRO', flag: flag('hr') },
  sui: { id: 'sui', name: 'Switzerland', code: 'SUI', flag: flag('ch') },
  alg: { id: 'alg', name: 'Algeria', code: 'ALG', flag: flag('dz') },
  aus: { id: 'aus', name: 'Australia', code: 'AUS', flag: flag('au') },
  egy: { id: 'egy', name: 'Egypt', code: 'EGY', flag: flag('eg') },
  arg: { id: 'arg', name: 'Argentina', code: 'ARG', flag: flag('ar') },
  cpv: { id: 'cpv', name: 'Cape Verde', code: 'CPV', flag: flag('cv') },
  col: { id: 'col', name: 'Colombia', code: 'COL', flag: flag('co') },
  gha: { id: 'gha', name: 'Ghana', code: 'GHA', flag: flag('gh') },
}

const roundOf32: MatchSeed[] = [
  { id: 73, date: '28 jun', venue: 'SoFi Stadium', home: teams.rsa, away: teams.can },
  { id: 74, date: '29 jun', venue: 'Gillette Stadium', home: teams.ger, away: teams.par },
  { id: 75, date: '29 jun', venue: 'Estadio BBVA', home: teams.ned, away: teams.mar },
  { id: 76, date: '29 jun', venue: 'NRG Stadium', home: teams.bra, away: teams.jpn },
  { id: 77, date: '30 jun', venue: 'MetLife Stadium', home: teams.fra, away: teams.swe },
  { id: 78, date: '30 jun', venue: 'AT&T Stadium', home: teams.civ, away: teams.nor },
  { id: 79, date: '30 jun', venue: 'Estadio Azteca', home: teams.mex, away: teams.ecu },
  { id: 80, date: '1 jul', venue: 'Mercedes-Benz Stadium', home: teams.eng, away: teams.cod },
  { id: 81, date: '1 jul', venue: "Levi's Stadium", home: teams.usa, away: teams.bih },
  { id: 82, date: '1 jul', venue: 'Lumen Field', home: teams.bel, away: teams.sen },
  { id: 83, date: '2 jul', venue: 'BMO Field', home: teams.por, away: teams.cro },
  { id: 84, date: '2 jul', venue: 'SoFi Stadium', home: teams.esp, away: teams.aut },
  { id: 85, date: '2 jul', venue: 'BC Place', home: teams.sui, away: teams.alg },
  { id: 86, date: '3 jul', venue: 'Hard Rock Stadium', home: teams.arg, away: teams.cpv },
  { id: 87, date: '3 jul', venue: 'Arrowhead Stadium', home: teams.col, away: teams.gha },
  { id: 88, date: '3 jul', venue: 'AT&T Stadium', home: teams.aus, away: teams.egy },
]

const pairings = {
  r16: [
    [89, 73, 75],
    [90, 74, 77],
    [91, 76, 78],
    [92, 79, 80],
    [93, 83, 84],
    [94, 81, 82],
    [95, 86, 88],
    [96, 85, 87],
  ],
  qf: [
    [97, 89, 90],
    [98, 93, 94],
    [99, 91, 92],
    [100, 95, 96],
  ],
  sf: [
    [101, 97, 98],
    [102, 99, 100],
  ],
  final: [[104, 101, 102]],
} satisfies Record<Exclude<RoundKey, 'r32'>, number[][]>

const bracketSides = {
  left: {
    r32: [73, 75, 74, 77, 83, 84, 81, 82],
    r16: [89, 90, 93, 94],
    qf: [97, 98],
    sf: [101],
  },
  right: {
    r32: [76, 78, 79, 80, 86, 88, 85, 87],
    r16: [91, 92, 95, 96],
    qf: [99, 100],
    sf: [102],
  },
}

function encodeState(winners: Winners, scores: Scores) {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ winners, scores }))))
  return payload.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function decodeState(value: string | null) {
  if (!value) return null
  try {
    const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
    const json = decodeURIComponent(escape(atob(normalized)))
    return JSON.parse(json) as { winners?: Winners; scores?: Scores }
  } catch {
    return null
  }
}

function teamFromWinner(matchId: number, winners: Winners) {
  const teamId = winners[matchId]
  return teamId ? teams[teamId] : undefined
}

function buildMatches(winners: Winners): Record<RoundKey, Match[]> {
  const base = roundOf32.map((match) => ({ ...match, round: 'r32' as const, label: `Jogo ${match.id}` }))
  const fromPairing = (round: Exclude<RoundKey, 'r32'>) =>
    pairings[round].map(([id, homeFrom, awayFrom]) => ({
      id,
      round,
      label: `Jogo ${id}`,
      home: teamFromWinner(homeFrom, winners),
      away: teamFromWinner(awayFrom, winners),
    }))

  return {
    r32: base,
    r16: fromPairing('r16'),
    qf: fromPairing('qf'),
    sf: fromPairing('sf'),
    final: fromPairing('final'),
  }
}

function pickMatches(rounds: Record<RoundKey, Match[]>, round: RoundKey, ids: number[]) {
  return ids.map((id) => rounds[round].find((match) => match.id === id)).filter((match): match is Match => Boolean(match))
}

function App() {
  const initial = decodeState(new URLSearchParams(window.location.search).get('p'))
  const [winners, setWinners] = useState<Winners>(initial?.winners ?? {})
  const [scores, setScores] = useState<Scores>(initial?.scores ?? {})
  const [showScores, setShowScores] = useState(false)
  const [printMode, setPrintMode] = useState(false)
  const [shareLabel, setShareLabel] = useState('Compartilhar palpite')

  const rounds = buildMatches(winners)
  const champion = teamFromWinner(104, winners)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (Object.keys(winners).length || Object.keys(scores).length) {
      params.set('p', encodeState(winners, scores))
    } else {
      params.delete('p')
    }
    const query = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
  }, [scores, winners])

  function chooseWinner(match: Match, team?: Team) {
    if (!team || !match.home || !match.away) return

    setWinners((current) => {
      const next = { ...current, [match.id]: team.id }
      let changed = true

      while (changed) {
        changed = false
        for (const [, matches] of Object.entries(pairings)) {
          for (const [nextMatchId, left, right] of matches) {
            const leftTeam = teamFromWinner(left, next)
            const rightTeam = teamFromWinner(right, next)
            const picked = next[nextMatchId]
            if (picked && (!leftTeam || !rightTeam || (picked !== leftTeam.id && picked !== rightTeam.id))) {
              delete next[nextMatchId]
              changed = true
            }
          }
        }
      }

      return next
    })
  }

  function updateScore(matchId: number, side: 'home' | 'away', value: string) {
    setScores((current) => {
      const matchScore = current[matchId] ?? { home: '', away: '' }
      return {
        ...current,
        [matchId]: { ...matchScore, [side]: value.replace(/\D/g, '').slice(0, 2) },
      }
    })
  }

  async function sharePrediction() {
    const url = window.location.href
    const text = champion
      ? `Meu campeão da Copa 2026: ${champion.name}`
      : 'Confira meu palpite para o mata-mata da Copa 2026.'

    if (navigator.share) {
      await navigator.share({ title: 'Palpite Copa 2026', text, url })
      return
    }

    await navigator.clipboard.writeText(url)
    setShareLabel('Link copiado')
    window.setTimeout(() => setShareLabel('Compartilhar palpite'), 1800)
  }

  return (
    <main className="page-shell">
      <header className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Copa do Mundo FIFA 2026</span>
          <h1>Monte seu caminho até a taça.</h1>
          <p>
            Escolha os vencedores em cada confronto, avance as seleções automaticamente e compartilhe seu
            palpite final em um link público.
          </p>
        </div>

        <div className="hero-actions">
          <button className="ghost-button print-toggle" type="button" onClick={() => setPrintMode((value) => !value)}>
            {printMode ? 'Mapa interativo' : 'Modo print'}
          </button>
          <button className="ghost-button" type="button" onClick={() => setShowScores((value) => !value)}>
            {showScores ? 'Ocultar placares' : 'Informar placares'}
          </button>
          <button className="primary-button" type="button" onClick={sharePrediction}>
            {shareLabel}
          </button>
        </div>

        <section className="champion-card" aria-live="polite">
          <span>Seu campeão</span>
          <strong>{champion?.name ?? 'Ainda em aberto'}</strong>
          <small>{champion ? 'Palpite completo pronto para compartilhar.' : 'Complete a final para revelar.'}</small>
        </section>
      </header>

      <section className="source-note">
        Confrontos da rodada de 32 carregados a partir de fonte pública consultada em 28/06/2026.
      </section>

      {printMode ? (
        <PrintSummary rounds={rounds} scores={scores} winners={winners} champion={champion} />
      ) : (
        <section className="bracket" aria-label="Mapa do mata-mata">
          <div className="bracket-side left-side">
            <RoundColumn
              matches={pickMatches(rounds, 'r32', bracketSides.left.r32)}
              round="r32"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
            <RoundColumn
              matches={pickMatches(rounds, 'r16', bracketSides.left.r16)}
              round="r16"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
            <RoundColumn
              matches={pickMatches(rounds, 'qf', bracketSides.left.qf)}
              round="qf"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
            <RoundColumn
              matches={pickMatches(rounds, 'sf', bracketSides.left.sf)}
              round="sf"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
          </div>

          <div className="final-center">
            <section className={`winner-spotlight ${champion ? 'has-champion' : ''}`} aria-live="polite">
              <span className="spotlight-label">Campeão</span>
              <div className="champion-flag">
                {champion ? <img alt={`Bandeira ${champion.name}`} src={champion.flag} /> : <span>?</span>}
              </div>
              <strong>{champion?.code ?? '---'}</strong>
            </section>

            <RoundColumn
              matches={rounds.final}
              round="final"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
          </div>

          <div className="bracket-side right-side">
            <RoundColumn
              matches={pickMatches(rounds, 'sf', bracketSides.right.sf)}
              round="sf"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
            <RoundColumn
              matches={pickMatches(rounds, 'qf', bracketSides.right.qf)}
              round="qf"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
            <RoundColumn
              matches={pickMatches(rounds, 'r16', bracketSides.right.r16)}
              round="r16"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
            <RoundColumn
              matches={pickMatches(rounds, 'r32', bracketSides.right.r32)}
              round="r32"
              scores={scores}
              showScores={showScores}
              winners={winners}
              onPick={chooseWinner}
              onScore={updateScore}
            />
          </div>
        </section>
      )}
    </main>
  )
}

function PrintSummary({
  rounds,
  scores,
  winners,
  champion,
}: {
  rounds: Record<RoundKey, Match[]>
  scores: Scores
  winners: Winners
  champion?: Team
}) {
  const printRounds: RoundKey[] = ['final', 'sf', 'qf', 'r16', 'r32']

  return (
    <section className="print-summary" aria-label="Resumo do palpite para print">
      <div className="print-hero">
        <span>Meu palpite Copa 2026</span>
        <div className="print-champion-flag">
          {champion ? <img alt={`Bandeira ${champion.name}`} src={champion.flag} /> : <strong>?</strong>}
        </div>
        <h2>{champion ? `${champion.code} campeão` : 'Campeão em aberto'}</h2>
      </div>

      <div className="print-rounds">
        {printRounds.map((round) => (
          <section className={`print-round print-${round}`} key={round}>
            <h3>{roundTitles[round]}</h3>
            <div className="print-match-grid">
              {rounds[round].map((match) => (
                <PrintMatchRow key={match.id} match={match} score={scores[match.id]} winnerId={winners[match.id]} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

function PrintMatchRow({ match, score, winnerId }: { match: Match; score?: Scores[number]; winnerId?: string }) {
  return (
    <div className="print-match-row">
      <PrintTeam team={match.home} selected={winnerId === match.home?.id} />
      <span className="print-score">{score?.home || '-'} x {score?.away || '-'}</span>
      <PrintTeam team={match.away} selected={winnerId === match.away?.id} />
    </div>
  )
}

function PrintTeam({ team, selected }: { team?: Team; selected: boolean }) {
  return (
    <span className={`print-team ${selected ? 'selected' : ''}`}>
      {team ? <img alt="" src={team.flag} /> : <span className="print-empty-flag" />}
      <strong>{team?.code ?? '---'}</strong>
    </span>
  )
}

function RoundColumn({
  round,
  matches,
  winners,
  scores,
  showScores,
  onPick,
  onScore,
}: {
  round: RoundKey
  matches: Match[]
  winners: Winners
  scores: Scores
  showScores: boolean
  onPick: (match: Match, team?: Team) => void
  onScore: (matchId: number, side: 'home' | 'away', value: string) => void
}) {
  return (
    <section className={`round-column round-${round}`}>
      <div className="round-title">
        <span>{roundTitles[round]}</span>
        <small>{matches.length} {matches.length === 1 ? 'jogo' : 'jogos'}</small>
      </div>

      <div className="match-list">
        {matches.map((match) => (
          <article className={`match-card ${winners[match.id] ? 'decided' : ''}`} key={match.id}>
            <div className="match-meta">
              <span>{match.label}</span>
              <small>{match.date ? `${match.date} · ${match.venue}` : 'Definido pelo seu palpite'}</small>
            </div>

            <TeamRow
              score={scores[match.id]?.home ?? ''}
              selected={winners[match.id] === match.home?.id}
              showScore={showScores}
              team={match.home}
              onPick={() => onPick(match, match.home)}
              onScore={(value) => onScore(match.id, 'home', value)}
            />
            <TeamRow
              score={scores[match.id]?.away ?? ''}
              selected={winners[match.id] === match.away?.id}
              showScore={showScores}
              team={match.away}
              onPick={() => onPick(match, match.away)}
              onScore={(value) => onScore(match.id, 'away', value)}
            />
          </article>
        ))}
      </div>
    </section>
  )
}

function TeamRow({
  team,
  selected,
  showScore,
  score,
  onPick,
  onScore,
}: {
  team?: Team
  selected: boolean
  showScore: boolean
  score: string
  onPick: () => void
  onScore: (value: string) => void
}) {
  return (
    <div className={`team-row ${selected ? 'selected' : ''} ${team ? '' : 'empty'}`}>
      <button type="button" disabled={!team} onClick={onPick}>
        <span className="team-flag">
          {team ? <img alt="" src={team.flag} /> : <span>{'---'}</span>}
        </span>
        <span className="team-code">{team?.code ?? '---'}</span>
      </button>
      {showScore && (
        <input
          aria-label={`Placar ${team?.name ?? 'pendente'}`}
          disabled={!team}
          inputMode="numeric"
          maxLength={2}
          onChange={(event) => onScore(event.target.value)}
          placeholder="0"
          value={score}
        />
      )}
    </div>
  )
}

export default App
