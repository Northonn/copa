import { useEffect, useState } from 'react'
import './App.css'
import { officialWinners } from './officialResults'

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

type ScoreSummary = {
  hits: number
  officialMatches: number
  points: number
}

const roundTitles: Record<RoundKey, string> = {
  r32: '16 avos',
  r16: 'Oitavas',
  qf: 'Quartas',
  sf: 'Semifinais',
  final: 'Final',
}

const roundPoints: Record<RoundKey, number> = {
  r32: 3,
  r16: 5,
  qf: 7,
  sf: 9,
  final: 11,
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

const flowOrder: Record<RoundKey, number[]> = {
  r32: roundOf32.map((match) => match.id),
  r16: pairings.r16.map(([id]) => id),
  qf: pairings.qf.map(([id]) => id),
  sf: pairings.sf.map(([id]) => id),
  final: pairings.final.map(([id]) => id),
}

const flowMatchIds = Object.values(flowOrder).flat()

function encodeState(winners: Winners, scores: Scores) {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ winners, scores }))))
  return payload.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function decodeState(value: string | null) {
  if (!value) return null
  try {
    const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const json = decodeURIComponent(escape(atob(padded)))
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

function getFlowMatches(rounds: Record<RoundKey, Match[]>) {
  const matches = Object.values(rounds).flat()
  return flowMatchIds
    .map((id) => matches.find((match) => match.id === id))
    .filter((match): match is Match => Boolean(match?.home && match.away))
}

function calculateScoreSummary(rounds: Record<RoundKey, Match[]>, winners: Winners): ScoreSummary {
  return Object.values(rounds).flat().reduce<ScoreSummary>((summary, match) => {
    const officialWinner = officialWinners[match.id]
    if (!officialWinner) return summary

    const hit = winners[match.id] === officialWinner
    return {
      hits: summary.hits + (hit ? 1 : 0),
      officialMatches: summary.officialMatches + 1,
      points: summary.points + (hit ? roundPoints[match.round] : 0),
    }
  }, { hits: 0, officialMatches: 0, points: 0 })
}

function App() {
  const initial = decodeState(new URLSearchParams(window.location.search).get('p'))
  const [winners, setWinners] = useState<Winners>(initial?.winners ?? {})
  const [scores, setScores] = useState<Scores>(initial?.scores ?? {})
  const [showScores, setShowScores] = useState(false)
  const [printMode, setPrintMode] = useState(false)
  const [mobileStep, setMobileStep] = useState(0)
  const [shareLabel, setShareLabel] = useState('Compartilhar palpite')

  const rounds = buildMatches(winners)
  const champion = teamFromWinner(104, winners)
  const flowMatches = getFlowMatches(rounds)
  const scoreSummary = calculateScoreSummary(rounds, winners)

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

        <div className="hero-status">
          <section className="champion-card" aria-live="polite">
            <span>Seu campeão</span>
            <strong>{champion?.name ?? 'Ainda em aberto'}</strong>
            <small>{champion ? 'Palpite completo pronto para compartilhar.' : 'Complete a final para revelar.'}</small>
          </section>

          <ScoreCard summary={scoreSummary} />
        </div>
      </header>

      <section className="source-note">
        Confrontos da rodada de 32 carregados a partir de fonte pública consultada em 28/06/2026.
      </section>

      {printMode ? (
        <PrintSummary rounds={rounds} scores={scores} winners={winners} champion={champion} />
      ) : (
        <>
          <MobilePredictionFlow
            champion={champion}
            matches={flowMatches}
            scores={scores}
            showScores={showScores}
            step={mobileStep}
            winners={winners}
            onBack={() => setMobileStep((value) => Math.max(0, value - 1))}
            onConfirm={(match, team) => {
              chooseWinner(match, team)
              setMobileStep((value) => Math.min(value + 1, flowMatchIds.length))
            }}
            onScore={updateScore}
            onShowPrint={() => setPrintMode(true)}
            onShare={sharePrediction}
          />

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
        </>
      )}

      <footer className="app-copyright">
        <span>(c) 2026 Northonn Oliveira.</span>
        <span>Todos os direitos reservados pelo desenvolvimento do app.</span>
      </footer>
    </main>
  )
}

function ScoreCard({ summary }: { summary: ScoreSummary }) {
  return (
    <section className="score-card" aria-live="polite">
      <span>Sua pontuação</span>
      <strong>{summary.points} pts</strong>
      <small>
        {summary.officialMatches
          ? `${summary.hits} ${summary.hits === 1 ? 'acerto' : 'acertos'} em ${summary.officialMatches} ${summary.officialMatches === 1 ? 'resultado oficial' : 'resultados oficiais'}`
          : 'Aguardando resultados oficiais'}
      </small>
    </section>
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
        <span>Meu palpite Copa 2026 - Desenvolvimento (c) Northonn Oliveira</span>
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
      <p className="print-copyright">Todos os direitos reservados pelo desenvolvimento do app.</p>
    </section>
  )
}

function MobilePredictionFlow({
  matches,
  winners,
  scores,
  showScores,
  step,
  champion,
  onConfirm,
  onBack,
  onScore,
  onShowPrint,
  onShare,
}: {
  matches: Match[]
  winners: Winners
  scores: Scores
  showScores: boolean
  step: number
  champion?: Team
  onConfirm: (match: Match, team: Team) => void
  onBack: () => void
  onScore: (matchId: number, side: 'home' | 'away', value: string) => void
  onShowPrint: () => void
  onShare: () => void
}) {
  const total = flowMatchIds.length
  const completed = Object.keys(winners).filter((id) => flowMatchIds.includes(Number(id))).length
  const currentIndex = Math.min(step, Math.max(matches.length - 1, 0))
  const currentMatch = matches[currentIndex]
  const currentMatchId = currentMatch?.id
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(currentMatchId ? winners[currentMatchId] : undefined)

  useEffect(() => {
    setSelectedTeamId(currentMatchId ? winners[currentMatchId] : undefined)
  }, [currentMatchId, winners])

  if (champion && step >= total) {
    return (
      <section className="mobile-flow mobile-flow-complete" aria-label="Palpite finalizado">
        <span className="mobile-flow-kicker">Palpite completo</span>
        <div className="mobile-winner-flag">
          <img alt={`Bandeira ${champion.name}`} src={champion.flag} />
        </div>
        <h2>{champion.code} campeão</h2>
        <p>Seu caminho até a taça está pronto para compartilhar.</p>
        <div className="mobile-flow-actions">
          <button className="ghost-button" type="button" onClick={onShowPrint}>Ver resumo</button>
          <button className="primary-button" type="button" onClick={onShare}>Compartilhar</button>
        </div>
      </section>
    )
  }

  if (!currentMatch?.home || !currentMatch.away) {
    return (
      <section className="mobile-flow" aria-label="Aguardando próximo jogo">
        <span className="mobile-flow-kicker">Próxima fase</span>
        <h2>Aguardando vencedores</h2>
        <p>Confirme os jogos anteriores para liberar o próximo confronto.</p>
      </section>
    )
  }

  const selectedTeam = selectedTeamId === currentMatch.home.id ? currentMatch.home : selectedTeamId === currentMatch.away.id ? currentMatch.away : undefined
  const progress = Math.min(100, Math.round((completed / total) * 100))

  return (
    <section className="mobile-flow" aria-label="Fluxo de palpites jogo a jogo">
      <div className="mobile-progress-head">
        <span>{roundTitles[currentMatch.round]}</span>
        <strong>Jogo {Math.min(completed + 1, total)} de {total}</strong>
      </div>
      <div className="mobile-progress-bar" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <article className="mobile-match-card">
        <div className="mobile-match-meta">
          <span>{currentMatch.label}</span>
          <small>{currentMatch.date ? `${currentMatch.date} · ${currentMatch.venue}` : 'Definido pelo seu palpite'}</small>
        </div>

        <div className="mobile-teams">
          <MobileTeamChoice team={currentMatch.home} selected={selectedTeamId === currentMatch.home.id} onPick={() => setSelectedTeamId(currentMatch.home?.id)} />
          <span className="mobile-versus">x</span>
          <MobileTeamChoice team={currentMatch.away} selected={selectedTeamId === currentMatch.away.id} onPick={() => setSelectedTeamId(currentMatch.away?.id)} />
        </div>

        {showScores && (
          <div className="mobile-score-row">
            <input
              aria-label={`Placar ${currentMatch.home.name}`}
              inputMode="numeric"
              maxLength={2}
              onChange={(event) => onScore(currentMatch.id, 'home', event.target.value)}
              placeholder="0"
              value={scores[currentMatch.id]?.home ?? ''}
            />
            <span>placar</span>
            <input
              aria-label={`Placar ${currentMatch.away.name}`}
              inputMode="numeric"
              maxLength={2}
              onChange={(event) => onScore(currentMatch.id, 'away', event.target.value)}
              placeholder="0"
              value={scores[currentMatch.id]?.away ?? ''}
            />
          </div>
        )}

        <button className="primary-button mobile-confirm" disabled={!selectedTeam} type="button" onClick={() => selectedTeam && onConfirm(currentMatch, selectedTeam)}>
          Confirmar vencedor
        </button>
      </article>

      <div className="mobile-flow-actions">
        <button className="ghost-button" disabled={step === 0} type="button" onClick={onBack}>Voltar</button>
        <button className="ghost-button" type="button" onClick={onShowPrint}>Ver resumo</button>
      </div>
    </section>
  )
}

function MobileTeamChoice({ team, selected, onPick }: { team: Team; selected: boolean; onPick: () => void }) {
  return (
    <button className={`mobile-team-choice ${selected ? 'selected' : ''}`} type="button" onClick={onPick}>
      <img alt={`Bandeira ${team.name}`} src={team.flag} />
      <strong>{team.code}</strong>
      <span>{team.name}</span>
    </button>
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
