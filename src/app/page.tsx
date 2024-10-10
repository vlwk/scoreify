import { AddForm } from '@/app/add-form';
import { MatchForm } from '@/app/match-form'; 
import postgres from "postgres";
import RegisteredTeams from './RegisteredTeams';
import MatchesList from './MatchesList';
import ScoreBoard from './ScoreBoard';
import { Control } from './control';
import Logs from './logs';
import { format } from "date-fns";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export default async function Home() {
  const teams = await sql`SELECT team_name, group_number, registered_date FROM scoreboard`;
  const mappedTeams = teams.map((row) => ({
    team_name: row.team_name, 
    group_number: row.group_number,
    registered_date: row.registered_date,
  }));

  const matches = await sql`SELECT * FROM matches`;
  const mappedMatches = matches.map((row) => ({
    team1_name: row.team1_name,
    team2_name: row.team2_name,
    team1_score: row.team1_score,
    team2_score: row.team2_score,
  }));
  const scoreboard = await sql`SELECT * FROM scoreboard ORDER BY group_number, score DESC`;
  const mappedScoreboard = scoreboard.map((row) => ({
    team_name: row.team_name,
    group_number: row.group_number,
    registered_date: row.registered_date,
    score: row.score,
    score_alt: row.score_alt,
    total_goals: row.total_goals,
  }));
  const logs = await sql`SELECT * FROM logs`;
  const mappedLogs = logs.map((row) => ({
    type: row.type,
    contents: row.contents,
    message: row.message,
    timestamp: row.timestamp,
  }));
  const formattedLogs = mappedLogs.map(log => ({
    ...log,
    timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')
  }));

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-12 sm:p-16 bg-bbt font-sans">
      <header className="row-start-1 text-center">
        <h1 className="text-4xl font-semibold text-gray-800">Team Registration</h1>
        <p className="text-gray-600 mt-2">View and manage your registered teams below.</p>
      </header>

      <main className="flex flex-col gap-8 row-start-2 w-full sm:max-w-2xl">
        <AddForm />
        <RegisteredTeams teams={mappedTeams} />
        <MatchForm />
        <MatchesList matches={mappedMatches} />
        <ScoreBoard scoreboard={mappedScoreboard} />
        <Logs logs={formattedLogs}/>
        <Control />
      </main>

      <footer className="row-start-3 text-center text-gray-500 text-sm">
        &copy; 2024 Victor Loh Wai Kit
      </footer>
    </div>
  );
}
