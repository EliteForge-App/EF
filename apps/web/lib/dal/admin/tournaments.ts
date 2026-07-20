export type CourtSize = '6vs6' | '8vs8' | '11vs11'

export type TournamentFormat = 'groups_of_4' | 'round_robin' | 'brackets'

export type TournamentStatus = 'draft' | 'registration' | 'active' | 'finished'

export type MatchStatus =
  | 'scheduled'
  | 'played'
  | 'walkover_home'
  | 'walkover_away'

export type Player = {
  id: string
  name: string
  isGoalkeeper: boolean
  goals: number
  goalsAgainst: number
  assists: number
  /** Defensa férrea: recuperos de balón ante ataque rival. */
  dfr: number
  yellowCards: number
  redCards: number
}

export type Team = {
  id: string
  name: string
  players: Player[]
  wins: number
  draws: number
  losses: number
  lossesByW: number
  points: number
  goalsFor: number
  goalsAgainst: number
  groupId?: string | null
}

export type MatchPlayerStat = {
  playerId: string
  teamId: string
  goals: number
  assists: number
  goalsAgainst: number
  dfr: number
  yellowCards: number
  redCards: number
}

export type Match = {
  id: string
  roundLabel: string
  keyIndex: number
  homeTeamId: string
  awayTeamId: string
  homeGoals: number | null
  awayGoals: number | null
  status: MatchStatus
  playerStats: MatchPlayerStat[]
  /** ISO inicio programado */
  startsAt?: string | null
  endsAt?: string | null
  /** 1 o 2 = cancha simultánea */
  courtNumber?: number
}

/** 0=dom … 6=sáb (Date.getDay). */
export type ScheduleConfig = {
  weekdays: number[]
  startHour: number
  endHour: number
  matchDurationHours: number
  /** 1 → 4 partidos/jornada (18–22); 2 → hasta 8. */
  courtsPerSlot: number
}

export const DEFAULT_SCHEDULE: ScheduleConfig = {
  weekdays: [3, 4], // mié / jue
  startHour: 18,
  endHour: 22,
  matchDurationHours: 1,
  courtsPerSlot: 1,
}

export const WEEKDAY_OPTIONS = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
] as const

export type Tournament = {
  id: string
  name: string
  courtSize: CourtSize
  format: TournamentFormat
  /** Máximo de equipos inscritos (≤ 16). */
  maxTeams: number
  /** Número de llaves del bracket. */
  bracketKeys: number
  /** Ronda extra si algún equipo quedó fuera de las llaves. */
  extraRoundEnabled: boolean
  status: TournamentStatus
  schedule: ScheduleConfig
  teams: Team[]
  matches: Match[]
  createdAt: string
  updatedAt: string
}

export const TOURNAMENTS_STORAGE_KEY = 'ef-admin-tournaments'
export const TOURNAMENT_RESERVATIONS_KEY = 'ef-admin-tournament-reservations'
export const MAX_TEAMS = 16

export function playersOnField(size: CourtSize) {
  if (size === '6vs6') return 6
  if (size === '8vs8') return 8
  return 11
}

/** Titulares en cancha + 4 suplentes. */
export function maxPlayersPerTeam(size: CourtSize) {
  return playersOnField(size) + 4
}

export function courtSizeLabel(size: CourtSize) {
  if (size === '6vs6') return '6 vs 6'
  if (size === '8vs8') return '8 vs 8'
  return '11 vs 11'
}

export function formatLabel(format: TournamentFormat) {
  if (format === 'groups_of_4') return 'Grupos de 4'
  if (format === 'round_robin') return 'Todos contra todos (top 4)'
  return 'Llaves / eliminación'
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function emptyPlayer(name = ''): Player {
  return {
    id: newId('player'),
    name,
    isGoalkeeper: false,
    goals: 0,
    goalsAgainst: 0,
    assists: 0,
    dfr: 0,
    yellowCards: 0,
    redCards: 0,
  }
}

export function emptyTeam(name: string): Team {
  return {
    id: newId('team'),
    name,
    players: [],
    wins: 0,
    draws: 0,
    losses: 0,
    lossesByW: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    groupId: null,
  }
}

export function createTournamentDraft(partial?: Partial<Tournament>): Tournament {
  const now = new Date().toISOString()
  return {
    id: newId('tournament'),
    name: partial?.name ?? 'Nuevo torneo',
    courtSize: partial?.courtSize ?? '6vs6',
    format: partial?.format ?? 'groups_of_4',
    maxTeams: Math.min(MAX_TEAMS, partial?.maxTeams ?? 16),
    bracketKeys: partial?.bracketKeys ?? 4,
    extraRoundEnabled: partial?.extraRoundEnabled ?? false,
    status: partial?.status ?? 'registration',
    schedule: {
      ...DEFAULT_SCHEDULE,
      ...(partial?.schedule ?? {}),
      weekdays:
        partial?.schedule?.weekdays?.length
          ? [...partial.schedule.weekdays]
          : [...DEFAULT_SCHEDULE.weekdays],
    },
    teams: [],
    matches: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function normalizeTournament(t: Tournament): Tournament {
  return {
    ...t,
    schedule: {
      ...DEFAULT_SCHEDULE,
      ...(t.schedule ?? {}),
      weekdays:
        t.schedule?.weekdays?.length > 0
          ? t.schedule.weekdays
          : [...DEFAULT_SCHEDULE.weekdays],
    },
  }
}

export function loadTournaments(): Tournament[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(TOURNAMENTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Tournament[]
    return Array.isArray(parsed) ? parsed.map(normalizeTournament) : []
  } catch {
    return []
  }
}

export function saveTournaments(items: Tournament[]) {
  localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(items))
}

export function upsertTournament(list: Tournament[], tournament: Tournament) {
  const next = [...list]
  const idx = next.findIndex((t) => t.id === tournament.id)
  const updated = { ...tournament, updatedAt: new Date().toISOString() }
  if (idx >= 0) next[idx] = updated
  else next.unshift(updated)
  saveTournaments(next)
  return next
}

export function deleteTournament(list: Tournament[], id: string) {
  const next = list.filter((t) => t.id !== id)
  saveTournaments(next)
  clearTournamentCalendarReservations(id)
  return next
}

/** Genera enfrentamientos según el formato (orden aleatorio / balanceado). */
export function generateFixture(tournament: Tournament): Match[] {
  if (tournament.teams.length < 2) return []

  let matches: Match[] = []
  if (tournament.format === 'groups_of_4') {
    matches = generateGroupsOfFour(tournament.teams)
  } else if (tournament.format === 'round_robin') {
    matches = generateRoundRobin(shuffle([...tournament.teams]))
  } else {
    matches = generateBrackets(
      shuffle([...tournament.teams]),
      tournament.bracketKeys,
      tournament.extraRoundEnabled,
    )
  }

  return scheduleMatches(matches, tournament.schedule ?? DEFAULT_SCHEDULE)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pairRound(
  home: Team,
  away: Team,
  roundLabel: string,
  keyIndex: number,
): Match {
  return {
    id: newId('match'),
    roundLabel,
    keyIndex,
    homeTeamId: home.id,
    awayTeamId: away.id,
    homeGoals: null,
    awayGoals: null,
    status: 'scheduled',
    playerStats: [],
    startsAt: null,
    endsAt: null,
    courtNumber: 1,
  }
}

function generateGroupsOfFour(teams: Team[]): Match[] {
  const withGroups = ensureGroupIds(teams)
  const byGroup = new Map<string, Team[]>()
  for (const team of withGroups) {
    const groupId = team.groupId || 'G?'
    const list = byGroup.get(groupId) ?? []
    list.push(team)
    byGroup.set(groupId, list)
  }

  let key = 0
  const buckets: Match[][] = []
  for (const [groupId, groupTeams] of byGroup) {
    const groupMatches: Match[] = []
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        groupMatches.push(
          pairRound(groupTeams[i], groupTeams[j], `Grupo ${groupId}`, key++),
        )
      }
    }
    buckets.push(shuffle(groupMatches))
  }

  const interleaved: Match[] = []
  let added = true
  while (added) {
    added = false
    for (const bucket of buckets) {
      const next = bucket.shift()
      if (next) {
        interleaved.push(next)
        added = true
      }
    }
  }
  return interleaved
}

export function assignGroups(teams: Team[]): Team[] {
  const shuffled = shuffle(teams)
  return shuffled.map((team, i) => ({
    ...team,
    groupId: `G${String.fromCharCode(65 + Math.floor(i / 4))}`,
  }))
}

/** Asigna grupo sin reordenar equipos existentes (preserva roster de pruebas). */
export function ensureGroupIds(teams: Team[]): Team[] {
  return teams.map((team, i) => ({
    ...team,
    groupId: `G${String.fromCharCode(65 + Math.floor(i / 4))}`,
  }))
}

/** Round-robin por método del círculo (rondas balanceadas) + shuffle de rondas. */
function generateRoundRobin(teams: Team[]): Match[] {
  const list = [...teams]
  if (list.length % 2 === 1) {
    list.push({
      ...emptyTeam('BYE'),
      id: '__bye__',
    })
  }
  const n = list.length
  const rounds = n - 1
  const half = n / 2
  const rotated = [...list]
  const roundBuckets: Match[][] = []
  let key = 0

  for (let r = 0; r < rounds; r++) {
    const roundMatches: Match[] = []
    for (let i = 0; i < half; i++) {
      const home = rotated[i]
      const away = rotated[n - 1 - i]
      if (home.id === '__bye__' || away.id === '__bye__') continue
      // Alternar local/visita entre rondas
      const [h, a] = r % 2 === 0 ? [home, away] : [away, home]
      roundMatches.push(
        pairRound(h, a, `Jornada ${r + 1}`, key++),
      )
    }
    roundBuckets.push(shuffle(roundMatches))
    // rotar (fijo el primero)
    const fixed = rotated[0]
    const rest = rotated.slice(1)
    rest.unshift(rest.pop()!)
    rotated.splice(0, rotated.length, fixed, ...rest)
  }

  const out: Match[] = []
  for (const bucket of shuffle(roundBuckets)) {
    out.push(...bucket)
  }
  return out
}

function generateBrackets(
  teams: Team[],
  bracketKeys: number,
  extraRound: boolean,
): Match[] {
  const matches: Match[] = []
  const keys = Math.max(1, bracketKeys)
  const slots = keys * 2
  const shuffled = shuffle(teams)
  const inBracket = shuffled.slice(0, slots)
  const overflow = shuffled.slice(slots)

  let key = 0
  const firstRound: Match[] = []
  for (let i = 0; i < inBracket.length; i += 2) {
    const home = inBracket[i]
    const away = inBracket[i + 1]
    if (!home || !away) break
    firstRound.push(
      pairRound(home, away, `Llave ${Math.floor(i / 2) + 1}`, key++),
    )
  }
  matches.push(...shuffle(firstRound))

  if (extraRound && overflow.length > 0) {
    const extra: Match[] = []
    for (let i = 0; i < overflow.length; i += 2) {
      const home = overflow[i]
      const away = overflow[i + 1]
      if (home && away) {
        extra.push(pairRound(home, away, 'Ronda extra', key++))
      }
    }
    matches.push(...shuffle(extra))
  }

  return matches
}

type Slot = { start: Date; end: Date; courtNumber: number }

function buildSlots(
  schedule: ScheduleConfig,
  needed: number,
  from = new Date(),
): Slot[] {
  const weekdays = schedule.weekdays.length
    ? schedule.weekdays
    : DEFAULT_SCHEDULE.weekdays
  const durationMs = schedule.matchDurationHours * 60 * 60 * 1000
  const courts = Math.min(2, Math.max(1, schedule.courtsPerSlot))
  const slots: Slot[] = []
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)
  // empezar desde mañana si ya pasó el horario de hoy
  let guard = 0
  while (slots.length < needed && guard < 400) {
    guard++
    const day = cursor.getDay()
    if (weekdays.includes(day)) {
      for (let hour = schedule.startHour; hour < schedule.endHour; hour += schedule.matchDurationHours) {
        for (let court = 1; court <= courts; court++) {
          const start = new Date(cursor)
          start.setHours(hour, 0, 0, 0)
          if (start.getTime() < from.getTime()) continue
          const end = new Date(start.getTime() + durationMs)
          slots.push({ start, end, courtNumber: court })
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return slots
}

/**
 * Asigna fechas/horarios/canchas evitando que el mismo equipo
 * juegue dos veces el mismo día cuando sea posible.
 */
export function scheduleMatches(
  matches: Match[],
  schedule: ScheduleConfig,
  from = new Date(),
): Match[] {
  const slots = buildSlots(schedule, matches.length + 8, from)
  const remaining = [...matches]
  const scheduled: Match[] = []
  const teamDay = new Map<string, Set<string>>() // teamId -> YYYY-MM-DD

  function dayKey(d: Date) {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  }

  for (const slot of slots) {
    if (remaining.length === 0) break
    const dk = dayKey(slot.start)
    let pickIdx = remaining.findIndex((m) => {
      const h = teamDay.get(m.homeTeamId)
      const a = teamDay.get(m.awayTeamId)
      return !h?.has(dk) && !a?.has(dk)
    })
    if (pickIdx < 0) {
      // fallback: cualquiera
      pickIdx = 0
    }
    const [match] = remaining.splice(pickIdx, 1)
    const homeSet = teamDay.get(match.homeTeamId) ?? new Set()
    homeSet.add(dk)
    teamDay.set(match.homeTeamId, homeSet)
    const awaySet = teamDay.get(match.awayTeamId) ?? new Set()
    awaySet.add(dk)
    teamDay.set(match.awayTeamId, awaySet)

    scheduled.push({
      ...match,
      startsAt: slot.start.toISOString(),
      endsAt: slot.end.toISOString(),
      courtNumber: slot.courtNumber,
    })
  }

  // Si faltaron slots, dejar sin fecha
  for (const left of remaining) {
    scheduled.push({ ...left, startsAt: null, endsAt: null, courtNumber: 1 })
  }
  return scheduled
}

export function addExtraRoundMatches(tournament: Tournament): Match[] {
  const used = new Set(
    tournament.matches.flatMap((m) => [m.homeTeamId, m.awayTeamId]),
  )
  const outside = shuffle(tournament.teams.filter((t) => !used.has(t.id)))
  if (outside.length < 2) return tournament.matches

  const extras: Match[] = []
  let key = tournament.matches.length
  for (let i = 0; i < outside.length; i += 2) {
    const home = outside[i]
    const away = outside[i + 1]
    if (home && away) {
      extras.push(pairRound(home, away, 'Ronda extra', key++))
    }
  }
  const timed = scheduleMatches(
    extras,
    tournament.schedule ?? DEFAULT_SCHEDULE,
    new Date(),
  )
  return [...tournament.matches, ...timed]
}

export type RankingPlayer = {
  playerId: string
  playerName: string
  teamName: string
  value: number
  isGoalkeeper: boolean
}

/** Goleadores top N. */
export function topScorers(tournament: Tournament, n = 5): RankingPlayer[] {
  const rows: RankingPlayer[] = []
  for (const team of tournament.teams) {
    for (const p of team.players) {
      if (p.goals <= 0) continue
      rows.push({
        playerId: p.id,
        playerName: p.name || 'Sin nombre',
        teamName: team.name,
        value: p.goals,
        isGoalkeeper: p.isGoalkeeper,
      })
    }
  }
  return rows.sort((a, b) => b.value - a.value).slice(0, n)
}

/**
 * Valla menos vencida: porteros con menos goles en contra (mín. 1 partido con GC registrado).
 */
export function leastBeatenGoalkeepers(
  tournament: Tournament,
  n = 5,
): RankingPlayer[] {
  const gkMatches = new Map<string, number>()
  for (const match of tournament.matches) {
    if (match.status !== 'played') continue
    for (const stat of match.playerStats) {
      gkMatches.set(
        stat.playerId,
        (gkMatches.get(stat.playerId) ?? 0) + 1,
      )
    }
  }

  const rows: RankingPlayer[] = []
  for (const team of tournament.teams) {
    for (const p of team.players) {
      if (!p.isGoalkeeper) continue
      const apps = gkMatches.get(p.id) ?? 0
      if (apps === 0 && p.goalsAgainst === 0) continue
      rows.push({
        playerId: p.id,
        playerName: p.name || 'Sin nombre',
        teamName: team.name,
        value: p.goalsAgainst,
        isGoalkeeper: true,
      })
    }
  }
  return rows
    .sort((a, b) => {
      if (a.value !== b.value) return a.value - b.value
      return a.playerName.localeCompare(b.playerName)
    })
    .slice(0, n)
}

export function formatMatchDate(iso: string | null | undefined) {
  if (!iso) return 'Sin fecha'
  const d = new Date(iso)
  return d.toLocaleString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Sincroniza reservas del calendario local para un torneo (no borra equipos). */
export function syncTournamentCalendarReservations(
  tournament: Tournament,
  venueName = 'Cancha Elite Demo',
) {
  if (typeof window === 'undefined') return
  type CalRow = {
    id: string
    user_id: string
    venue_id: string | null
    venue_name: string
    starts_at: string
    ends_at: string
    status: 'confirmed'
    notes: string
    created_at: string
    guest_name: string
    court_size: CourtSize
    is_demo?: boolean
    tournament_id?: string
  }

  let existing: CalRow[] = []
  try {
    const raw = localStorage.getItem(TOURNAMENT_RESERVATIONS_KEY)
    if (raw) existing = JSON.parse(raw) as CalRow[]
  } catch {
    existing = []
  }

  const withoutThis = existing.filter((r) => r.tournament_id !== tournament.id)
  const teamName = (id: string) =>
    tournament.teams.find((t) => t.id === id)?.name ?? 'Equipo'

  const created: CalRow[] = []
  for (const match of tournament.matches) {
    if (!match.startsAt || !match.endsAt) continue
    const home = teamName(match.homeTeamId)
    const away = teamName(match.awayTeamId)
    created.push({
      id: `torneo-${tournament.id}-${match.id}`,
      user_id: `tournament-${tournament.id}`,
      venue_id: null,
      venue_name: venueName,
      starts_at: match.startsAt,
      ends_at: match.endsAt,
      status: 'confirmed',
      notes: `${tournament.name} · Cancha ${match.courtNumber ?? 1}`,
      created_at: new Date().toISOString(),
      guest_name: `${home} vs ${away}`,
      court_size: tournament.courtSize,
      is_demo: false,
      tournament_id: tournament.id,
    })
  }

  localStorage.setItem(
    TOURNAMENT_RESERVATIONS_KEY,
    JSON.stringify([...withoutThis, ...created]),
  )
}

export function clearTournamentCalendarReservations(tournamentId: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(TOURNAMENT_RESERVATIONS_KEY)
    if (!raw) return
    const existing = JSON.parse(raw) as Array<{ tournament_id?: string }>
    localStorage.setItem(
      TOURNAMENT_RESERVATIONS_KEY,
      JSON.stringify(existing.filter((r) => r.tournament_id !== tournamentId)),
    )
  } catch {
    /* ignore */
  }
}

type StandingRow = Team & { played: number }

export function recomputeStandings(tournament: Tournament): Tournament {
  const teams = tournament.teams.map((t) => ({
    ...t,
    wins: 0,
    draws: 0,
    losses: 0,
    lossesByW: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    players: t.players.map((p) => ({
      ...p,
      goals: 0,
      goalsAgainst: 0,
      assists: 0,
      dfr: 0,
      yellowCards: 0,
      redCards: 0,
    })),
  }))

  const byId = new Map(teams.map((t) => [t.id, t]))

  for (const match of tournament.matches) {
    const home = byId.get(match.homeTeamId)
    const away = byId.get(match.awayTeamId)
    if (!home || !away) continue

    if (match.status === 'walkover_home') {
      away.lossesByW += 1
      away.losses += 1
      home.wins += 1
      home.points += 3
      continue
    }
    if (match.status === 'walkover_away') {
      home.lossesByW += 1
      home.losses += 1
      away.wins += 1
      away.points += 3
      continue
    }
    if (match.status !== 'played') continue
    if (match.homeGoals == null || match.awayGoals == null) continue

    home.goalsFor += match.homeGoals
    home.goalsAgainst += match.awayGoals
    away.goalsFor += match.awayGoals
    away.goalsAgainst += match.homeGoals

    if (match.homeGoals > match.awayGoals) {
      home.wins += 1
      home.points += 3
      away.losses += 1
    } else if (match.homeGoals < match.awayGoals) {
      away.wins += 1
      away.points += 3
      home.losses += 1
    } else {
      home.draws += 1
      away.draws += 1
      home.points += 1
      away.points += 1
    }

    for (const stat of match.playerStats) {
      const team = byId.get(stat.teamId)
      const player = team?.players.find((p) => p.id === stat.playerId)
      if (!player) continue
      player.goals += stat.goals
      player.assists += stat.assists
      player.goalsAgainst += stat.goalsAgainst
      player.dfr += stat.dfr ?? 0
      player.yellowCards += stat.yellowCards
      player.redCards += stat.redCards
    }
  }

  return { ...tournament, teams: Array.from(byId.values()) }
}

export function topFourFromRoundRobin(tournament: Tournament): Team[] {
  return [...tournament.teams]
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      const gdA = a.goalsFor - a.goalsAgainst
      const gdB = b.goalsFor - b.goalsAgainst
      if (gdB !== gdA) return gdB - gdA
      return b.goalsFor - a.goalsFor
    })
    .slice(0, 4)
}

export function standingSort(a: StandingRow, b: StandingRow) {
  if (b.points !== a.points) return b.points - a.points
  const gdA = a.goalsFor - a.goalsAgainst
  const gdB = b.goalsFor - b.goalsAgainst
  if (gdB !== gdA) return gdB - gdA
  return b.goalsFor - a.goalsFor
}

export function withPlayedCount(teams: Team[], matches: Match[]): StandingRow[] {
  return teams.map((t) => {
    const played = matches.filter(
      (m) =>
        (m.homeTeamId === t.id || m.awayTeamId === t.id) &&
        m.status !== 'scheduled',
    ).length
    return { ...t, played }
  })
}
