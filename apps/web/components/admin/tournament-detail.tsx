'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  addExtraRoundMatches,
  courtSizeLabel,
  emptyPlayer,
  emptyTeam,
  ensureGroupIds,
  formatLabel,
  formatMatchDate,
  generateFixture,
  maxPlayersPerTeam,
  recomputeStandings,
  syncTournamentCalendarReservations,
  topFourFromRoundRobin,
  withPlayedCount,
  standingSort,
  WEEKDAY_OPTIONS,
  DEFAULT_SCHEDULE,
  type Match,
  type MatchPlayerStat,
  type MatchStatus,
  type Tournament,
  type TournamentFormat,
  type CourtSize,
  MAX_TEAMS,
} from '@/lib/dal/admin/tournaments'
import { TournamentRankingsModal } from '@/components/admin/tournament-rankings-modal'

const BRAND = { emerald: '#00CEC8', orange: '#FF8C00' } as const

type Tab = 'config' | 'teams' | 'standings' | 'matches'

export function TournamentDetail({
  tournament,
  onChange,
  onBack,
  onDelete,
}: {
  tournament: Tournament
  onChange: (t: Tournament) => void
  onBack: () => void
  onDelete: () => void
}) {
  const [tab, setTab] = useState<Tab>('teams')
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null)
  const [rankingsOpen, setRankingsOpen] = useState(false)

  const rosterCap = maxPlayersPerTeam(tournament.courtSize)
  const teamMap = useMemo(
    () => new Map(tournament.teams.map((t) => [t.id, t])),
    [tournament.teams],
  )

  const standings = useMemo(() => {
    const rows = withPlayedCount(tournament.teams, tournament.matches)
    if (tournament.format === 'groups_of_4') {
      const groups = new Map<string, typeof rows>()
      for (const row of rows) {
        const g = row.groupId || 'Sin grupo'
        const list = groups.get(g) ?? []
        list.push(row)
        groups.set(g, list)
      }
      return Array.from(groups.entries()).map(([groupId, list]) => ({
        groupId,
        rows: [...list].sort(standingSort),
      }))
    }
    return [
      {
        groupId: 'Tabla general',
        rows: [...rows].sort(standingSort),
      },
    ]
  }, [tournament])

  function patch(partial: Partial<Tournament>) {
    onChange({ ...tournament, ...partial })
  }

  function updateTeam(teamId: string, updater: (t: Tournament['teams'][0]) => Tournament['teams'][0]) {
    onChange({
      ...tournament,
      teams: tournament.teams.map((t) => (t.id === teamId ? updater(t) : t)),
    })
  }

  function addTeam() {
    if (tournament.teams.length >= tournament.maxTeams) return
    const name = `Equipo ${tournament.teams.length + 1}`
    let teams = [...tournament.teams, emptyTeam(name)]
    if (tournament.format === 'groups_of_4') teams = ensureGroupIds(teams)
    onChange({ ...tournament, teams })
  }

  function removeTeam(teamId: string) {
    onChange({
      ...tournament,
      teams: tournament.teams.filter((t) => t.id !== teamId),
      matches: tournament.matches.filter(
        (m) => m.homeTeamId !== teamId && m.awayTeamId !== teamId,
      ),
    })
  }

  function regenerateFixture() {
    // Conserva equipos/jugadores; solo reasigna grupos si aplica y agenda partidos.
    let teams = tournament.teams
    if (tournament.format === 'groups_of_4') {
      teams = ensureGroupIds(teams)
    }
    const matches = generateFixture({ ...tournament, teams })
    const next = recomputeStandings({ ...tournament, teams, matches })
    syncTournamentCalendarReservations(next)
    onChange(next)
  }

  function enableExtraRound() {
    const matches = addExtraRoundMatches({
      ...tournament,
      extraRoundEnabled: true,
    })
    const next = { ...tournament, extraRoundEnabled: true, matches }
    syncTournamentCalendarReservations(next)
    onChange(next)
  }

  function saveMatch(match: Match) {
    const matches = tournament.matches.map((m) =>
      m.id === match.id ? match : m,
    )
    onChange(recomputeStandings({ ...tournament, matches }))
    setEditingMatchId(null)
  }

  function toggleWeekday(day: number) {
    const current = tournament.schedule?.weekdays ?? DEFAULT_SCHEDULE.weekdays
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort((a, b) => a - b)
    onChange({
      ...tournament,
      schedule: {
        ...(tournament.schedule ?? DEFAULT_SCHEDULE),
        weekdays: next.length ? next : [...DEFAULT_SCHEDULE.weekdays],
      },
    })
  }

  const editingMatch = tournament.matches.find((m) => m.id === editingMatchId)
  const schedule = tournament.schedule ?? DEFAULT_SCHEDULE
  const sortedMatches = useMemo(
    () =>
      [...tournament.matches].sort((a, b) => {
        const ta = a.startsAt ? new Date(a.startsAt).getTime() : Number.MAX_SAFE_INTEGER
        const tb = b.startsAt ? new Date(b.startsAt).getTime() : Number.MAX_SAFE_INTEGER
        return ta - tb
      }),
    [tournament.matches],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Volver a torneos
          </button>
          <h2 className="mt-2 font-heading text-2xl font-bold uppercase italic tracking-tight text-foreground">
            {tournament.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {courtSizeLabel(tournament.courtSize)} ·{' '}
            {formatLabel(tournament.format)} · {tournament.teams.length}/
            {tournament.maxTeams} equipos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRankingsOpen(true)}
          >
            Rankings (podio)
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onDelete}>
            Eliminar torneo
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['config', 'Configuración'],
            ['teams', 'Equipos'],
            ['standings', 'Tabla'],
            ['matches', 'Partidos'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-secondary/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'config' && (
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="t-name">Nombre</Label>
              <Input
                id="t-name"
                value={tournament.name}
                onChange={(e) => patch({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-size">Formato de cancha</Label>
              <select
                id="t-size"
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={tournament.courtSize}
                onChange={(e) =>
                  patch({ courtSize: e.target.value as CourtSize })
                }
              >
                <option value="6vs6">6 vs 6 (máx. {maxPlayersPerTeam('6vs6')} jug.)</option>
                <option value="8vs8">8 vs 8 (máx. {maxPlayersPerTeam('8vs8')} jug.)</option>
                <option value="11vs11">
                  11 vs 11 (máx. {maxPlayersPerTeam('11vs11')} jug.)
                </option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-format">Tipo de torneo</Label>
              <select
                id="t-format"
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={tournament.format}
                onChange={(e) =>
                  patch({ format: e.target.value as TournamentFormat })
                }
              >
                <option value="groups_of_4">Grupos de 4</option>
                <option value="round_robin">
                  Todos contra todos (pasan top 4)
                </option>
                <option value="brackets">Llaves / eliminación</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-max">Máx. equipos (≤ {MAX_TEAMS})</Label>
              <Input
                id="t-max"
                type="number"
                min={2}
                max={MAX_TEAMS}
                value={tournament.maxTeams}
                onChange={(e) =>
                  patch({
                    maxTeams: Math.min(
                      MAX_TEAMS,
                      Math.max(2, Number(e.target.value || 2)),
                    ),
                  })
                }
              />
            </div>
            {tournament.format === 'brackets' && (
              <div className="space-y-2">
                <Label htmlFor="t-keys">Cantidad de llaves</Label>
                <Input
                  id="t-keys"
                  type="number"
                  min={1}
                  max={8}
                  value={tournament.bracketKeys}
                  onChange={(e) =>
                    patch({
                      bracketKeys: Math.max(1, Number(e.target.value || 1)),
                    })
                  }
                />
                <p className="text-[11px] text-muted-foreground">
                  Cada llave inicia con 2 equipos ({tournament.bracketKeys * 2}{' '}
                  cupos en bracket).
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="t-status">Estado</Label>
              <select
                id="t-status"
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={tournament.status}
                onChange={(e) =>
                  patch({
                    status: e.target.value as Tournament['status'],
                  })
                }
              >
                <option value="draft">Borrador</option>
                <option value="registration">Inscripciones</option>
                <option value="active">En juego</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border/80 bg-secondary/20 p-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide">
              Calendario del torneo
            </h3>
            <p className="text-xs text-muted-foreground">
              Elige días y franja. Al generar partidos se reservan en el
              calendario admin (p. ej. mié/jue 18:00–22:00 → 4 partidos/día, o 8
              con 2 canchas).
            </p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_OPTIONS.map((d) => {
                const on = schedule.weekdays.includes(d.value)
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleWeekday(d.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      on
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="space-y-1">
                <Label>Hora inicio</Label>
                <Input
                  type="number"
                  min={6}
                  max={22}
                  value={schedule.startHour}
                  onChange={(e) =>
                    onChange({
                      ...tournament,
                      schedule: {
                        ...schedule,
                        startHour: Number(e.target.value || 18),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Hora fin</Label>
                <Input
                  type="number"
                  min={7}
                  max={23}
                  value={schedule.endHour}
                  onChange={(e) =>
                    onChange({
                      ...tournament,
                      schedule: {
                        ...schedule,
                        endHour: Number(e.target.value || 22),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Canchas simultáneas</Label>
                <select
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  value={schedule.courtsPerSlot}
                  onChange={(e) =>
                    onChange({
                      ...tournament,
                      schedule: {
                        ...schedule,
                        courtsPerSlot: Number(e.target.value) as 1 | 2,
                      },
                    })
                  }
                >
                  <option value={1}>1 cancha (~4 partidos/jornada)</option>
                  <option value={2}>2 canchas (~8 partidos/jornada)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Duración (h)</Label>
                <Input
                  type="number"
                  min={1}
                  max={3}
                  value={schedule.matchDurationHours}
                  onChange={(e) =>
                    onChange({
                      ...tournament,
                      schedule: {
                        ...schedule,
                        matchDurationHours: Number(e.target.value || 1),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={regenerateFixture}>
              Generar / regenerar partidos + reservas
            </Button>
            {tournament.format === 'brackets' && (
              <Button type="button" variant="outline" onClick={enableExtraRound}>
                Añadir ronda extra (equipos fuera de llave)
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Regenerar solo reordena y agenda partidos. Los equipos y jugadores
            que registraste a mano se conservan.
          </p>
          {tournament.format === 'round_robin' && (
            <p className="text-xs text-muted-foreground">
              Clasifican los 4 primeros por puntos:{' '}
              {topFourFromRoundRobin(tournament)
                .map((t) => t.name)
                .join(', ') || '—'}
            </p>
          )}
        </section>
      )}

      {tab === 'teams' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Registro manual. Máx. {rosterCap} jugadores por equipo (
              {rosterCap - 4} en cancha + 4 suplentes).
            </p>
            <Button
              type="button"
              onClick={addTeam}
              disabled={tournament.teams.length >= tournament.maxTeams}
            >
              <Plus className="mr-1 h-4 w-4" />
              Añadir equipo
            </Button>
          </div>

          {tournament.teams.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Aún no hay equipos. Regístralos manualmente.
            </p>
          )}

          {tournament.teams.map((team) => (
            <div
              key={team.id}
              className="space-y-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  value={team.name}
                  onChange={(e) =>
                    updateTeam(team.id, (t) => ({ ...t, name: e.target.value }))
                  }
                  className="max-w-xs font-semibold"
                />
                {team.groupId && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                    Grupo {team.groupId}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeTeam(team.id)}
                  className="ml-auto text-muted-foreground hover:text-destructive"
                  aria-label="Eliminar equipo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                      <th className="pb-2 pr-2">Jugador</th>
                      <th className="pb-2 pr-2">Portero</th>
                      <th className="pb-2 pr-2">Goles</th>
                      <th className="pb-2 pr-2">GC</th>
                      <th className="pb-2 pr-2">TA</th>
                      <th className="pb-2 pr-2">TR</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {team.players.map((player) => (
                      <tr key={player.id} className="border-b border-border/50">
                        <td className="py-2 pr-2">
                          <Input
                            value={player.name}
                            onChange={(e) =>
                              updateTeam(team.id, (t) => ({
                                ...t,
                                players: t.players.map((p) =>
                                  p.id === player.id
                                    ? { ...p, name: e.target.value }
                                    : p,
                                ),
                              }))
                            }
                            placeholder="Nombre"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            type="checkbox"
                            checked={player.isGoalkeeper}
                            onChange={(e) =>
                              updateTeam(team.id, (t) => ({
                                ...t,
                                players: t.players.map((p) =>
                                  p.id === player.id
                                    ? { ...p, isGoalkeeper: e.target.checked }
                                    : p,
                                ),
                              }))
                            }
                          />
                        </td>
                        <td className="py-2 pr-2 font-semibold">{player.goals}</td>
                        <td className="py-2 pr-2">
                          {player.isGoalkeeper ? player.goalsAgainst : '—'}
                        </td>
                        <td className="py-2 pr-2" style={{ color: BRAND.orange }}>
                          {player.yellowCards}
                        </td>
                        <td className="py-2 pr-2 text-destructive">
                          {player.redCards}
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateTeam(team.id, (t) => ({
                                ...t,
                                players: t.players.filter(
                                  (p) => p.id !== player.id,
                                ),
                              }))
                            }
                          >
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={team.players.length >= rosterCap}
                onClick={() =>
                  updateTeam(team.id, (t) => ({
                    ...t,
                    players: [...t.players, emptyPlayer('')],
                  }))
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                Jugador ({team.players.length}/{rosterCap})
              </Button>

              <p className="text-xs text-muted-foreground">
                PJ vía partidos · PG {team.wins} · PE {team.draws} · PP{' '}
                {team.losses} · PPW {team.lossesByW} · Pts {team.points}
              </p>
            </div>
          ))}
        </section>
      )}

      {tab === 'standings' && (
        <section className="space-y-6">
          {standings.map((block) => (
            <div
              key={block.groupId}
              className="overflow-x-auto rounded-2xl border border-border bg-card p-5"
            >
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide">
                {block.groupId}
              </h3>
              <table className="mt-3 w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                    <th className="pb-2 pr-2">Equipo</th>
                    <th className="pb-2 pr-2">PJ</th>
                    <th className="pb-2 pr-2">PG</th>
                    <th className="pb-2 pr-2">PE</th>
                    <th className="pb-2 pr-2">PP</th>
                    <th className="pb-2 pr-2">PPW</th>
                    <th className="pb-2 pr-2">GF</th>
                    <th className="pb-2 pr-2">GC</th>
                    <th className="pb-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.id} className="border-b border-border/40">
                      <td className="py-2 pr-2 font-semibold">{row.name}</td>
                      <td className="py-2 pr-2">{row.played}</td>
                      <td className="py-2 pr-2">{row.wins}</td>
                      <td className="py-2 pr-2">{row.draws}</td>
                      <td className="py-2 pr-2">{row.losses}</td>
                      <td className="py-2 pr-2">{row.lossesByW}</td>
                      <td className="py-2 pr-2">{row.goalsFor}</td>
                      <td className="py-2 pr-2">{row.goalsAgainst}</td>
                      <td
                        className="py-2 font-bold"
                        style={{ color: BRAND.emerald }}
                      >
                        {row.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      )}

      {tab === 'matches' && (
        <section className="space-y-4">
          {sortedMatches.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              No hay partidos. Ve a Configuración y genera el fixture.
            </p>
          )}
          {sortedMatches.map((match) => {
            const home = teamMap.get(match.homeTeamId)
            const away = teamMap.get(match.awayTeamId)
            return (
              <div
                key={match.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {match.roundLabel}
                    {match.courtNumber ? ` · Cancha ${match.courtNumber}` : ''}
                  </p>
                  <p className="mt-1 text-xs font-medium text-primary">
                    {formatMatchDate(match.startsAt)}
                  </p>
                  <p className="mt-1 font-heading text-sm font-semibold">
                    {home?.name ?? '?'}{' '}
                    <span className="text-muted-foreground">
                      {match.homeGoals ?? '-'} : {match.awayGoals ?? '-'}
                    </span>{' '}
                    {away?.name ?? '?'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {match.status === 'scheduled' && 'Programado'}
                    {match.status === 'played' && 'Jugado'}
                    {match.status === 'walkover_home' && 'W a favor local'}
                    {match.status === 'walkover_away' && 'W a favor visitante'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMatchId(match.id)}
                >
                  Registrar resultado
                </Button>
              </div>
            )
          })}
        </section>
      )}

      {editingMatch && (
        <MatchEditorModal
          match={editingMatch}
          tournament={tournament}
          onClose={() => setEditingMatchId(null)}
          onSave={saveMatch}
        />
      )}

      {rankingsOpen && (
        <TournamentRankingsModal
          tournament={tournament}
          onClose={() => setRankingsOpen(false)}
        />
      )}
    </div>
  )
}

function MatchEditorModal({
  match,
  tournament,
  onClose,
  onSave,
}: {
  match: Match
  tournament: Tournament
  onClose: () => void
  onSave: (match: Match) => void
}) {
  const home = tournament.teams.find((t) => t.id === match.homeTeamId)
  const away = tournament.teams.find((t) => t.id === match.awayTeamId)
  const [status, setStatus] = useState<MatchStatus>(match.status)
  const [homeGoals, setHomeGoals] = useState(match.homeGoals ?? 0)
  const [awayGoals, setAwayGoals] = useState(match.awayGoals ?? 0)
  const [stats, setStats] = useState<MatchPlayerStat[]>(() => {
    if (match.playerStats.length) return match.playerStats
    const seed: MatchPlayerStat[] = []
    for (const team of [home, away]) {
      if (!team) continue
      for (const p of team.players) {
        seed.push({
          playerId: p.id,
          teamId: team.id,
          goals: 0,
          assists: 0,
          goalsAgainst: 0,
          dfr: 0,
          yellowCards: 0,
          redCards: 0,
        })
      }
    }
    return seed
  })

  function updateStat(
    playerId: string,
    patch: Partial<MatchPlayerStat>,
  ) {
    setStats((prev) =>
      prev.map((s) => (s.playerId === playerId ? { ...s, ...patch } : s)),
    )
  }

  function submit() {
    onSave({
      ...match,
      status,
      homeGoals:
        status === 'played'
          ? homeGoals
          : status.startsWith('walkover')
            ? status === 'walkover_home'
              ? 3
              : 0
            : null,
      awayGoals:
        status === 'played'
          ? awayGoals
          : status.startsWith('walkover')
            ? status === 'walkover_away'
              ? 3
              : 0
            : null,
      playerStats: status === 'played' ? stats : [],
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-bold uppercase italic">
              Resultado
            </h3>
            <p className="text-sm text-muted-foreground">
              {home?.name} vs {away?.name}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Estado</Label>
            <select
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as MatchStatus)}
            >
              <option value="scheduled">Programado</option>
              <option value="played">Jugado</option>
              <option value="walkover_home">W (gana local)</option>
              <option value="walkover_away">W (gana visitante)</option>
            </select>
          </div>
          {status === 'played' && (
            <>
              <div className="space-y-2">
                <Label>Goles {home?.name}</Label>
                <Input
                  type="number"
                  min={0}
                  value={homeGoals}
                  onChange={(e) => setHomeGoals(Number(e.target.value || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label>Goles {away?.name}</Label>
                <Input
                  type="number"
                  min={0}
                  value={awayGoals}
                  onChange={(e) => setAwayGoals(Number(e.target.value || 0))}
                />
              </div>
            </>
          )}
        </div>

        {status === 'played' && (
          <div className="mt-5 space-y-4">
            {[home, away].map((team) =>
              team ? (
                <div key={team.id}>
                  <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-wide">
                    Stats — {team.name}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead>
                        <tr className="text-xs uppercase text-muted-foreground">
                          <th className="pb-2 pr-2">Jugador</th>
                          <th className="pb-2 pr-2">Goles</th>
                          <th className="pb-2 pr-2">GC</th>
                          <th className="pb-2 pr-2">TA</th>
                          <th className="pb-2">TR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.players.map((player) => {
                          const row = stats.find(
                            (s) => s.playerId === player.id,
                          ) ?? {
                            playerId: player.id,
                            teamId: team.id,
                            goals: 0,
                            assists: 0,
                            goalsAgainst: 0,
                            dfr: 0,
                            yellowCards: 0,
                            redCards: 0,
                          }
                          return (
                            <tr key={player.id}>
                              <td className="py-1.5 pr-2">
                                {player.name || 'Sin nombre'}
                                {player.isGoalkeeper ? ' (PT)' : ''}
                              </td>
                              {(
                                [
                                  'goals',
                                  'goalsAgainst',
                                  'yellowCards',
                                  'redCards',
                                ] as const
                              ).map((field) => (
                                <td key={field} className="py-1.5 pr-2">
                                  <Input
                                    type="number"
                                    min={0}
                                    className="h-8 w-16"
                                    disabled={
                                      field === 'goalsAgainst' &&
                                      !player.isGoalkeeper
                                    }
                                    value={row[field] ?? 0}
                                    onChange={(e) =>
                                      updateStat(player.id, {
                                        [field]: Number(e.target.value || 0),
                                      })
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null,
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={submit}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}
