import { AddForm } from '@/app/add-form';
import { MatchForm } from '@/app/match-form'; 
import postgres from "postgres";
import RegisteredTeams from './RegisteredTeams';
import MatchesList from './MatchesList';
import ScoreBoard from './ScoreBoard';
import { Control } from './control';

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export default async function Home() {
  let teams = await sql`SELECT team_name, group_number, registered_date FROM scoreboard`;
  let matches = await sql`SELECT * FROM matches`;
  let scoreboard = await sql`SELECT * FROM scoreboard ORDER BY group_number, score DESC`;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-12 sm:p-16 bg-bbt font-sans">
      <header className="row-start-1 text-center">
        <h1 className="text-4xl font-semibold text-gray-800">Team Registration</h1>
        <p className="text-gray-600 mt-2">View and manage your registered teams below.</p>
      </header>

      <main className="flex flex-col gap-8 row-start-2 w-full sm:max-w-2xl">
        <AddForm />
        <RegisteredTeams teams={teams} />
        <MatchForm />
        <MatchesList matches={matches} />
        <ScoreBoard scoreboard={scoreboard} />
        <Control />
      </main>

      <footer className="row-start-3 text-center text-gray-500 text-sm">
        &copy; 2024 Victor Loh Wai Kit
      </footer>
    </div>
  );
}
