import { AddForm } from "@/app/AddForm";
import { MatchForm } from "@/app/MatchForm";

import RegisteredTeams from "./RegisteredTeamsList";
import MatchesList from "./MatchesList";
import ScoreBoard from "./ScoreBoard";
import { Control } from "./ControlForm";
import Logs from "./LogsList";
import { format } from "date-fns";
import { validateRequest } from "@/lib/auth";
import { sql } from "@/lib/db";
import { SignUp } from "./SignUpForm";
import { LogIn } from "./LoginForm";
import { CurrentUser } from "./SignOutForm";

export default async function Home() {
  const { user } = await validateRequest();

  const teams =
    await sql`SELECT team_name, group_number, registered_date FROM scoreboard`;
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
  const scoreboard =
    await sql`SELECT * FROM scoreboard ORDER BY group_number, score DESC`;
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
  const formattedLogs = mappedLogs.map((log) => ({
    ...log,
    timestamp: format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
  }));

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-12 sm:p-16 bg-bbt font-sans">
      <header className="row-start-1 text-center">
        <h1 className="text-4xl font-semibold text-gray-800">Bubble Team</h1>
        <p className="text-gray-600 mt-2">View and manage your teams!</p>
      </header>

      <main className="flex flex-col gap-8 row-start-2 w-full sm:max-w-2xl">
        {!user ? (
          <>
            <SignUp />
            <LogIn />
          </>
        ) : (
          <>
            <CurrentUser username={user.username} />

            <AddForm />
            <RegisteredTeams teams={mappedTeams} />
            <MatchForm />
            <MatchesList matches={mappedMatches} />
            <ScoreBoard scoreboard={mappedScoreboard} />
            <Logs logs={formattedLogs} />
            {user?.username === "administrator" && <Control />}
          </>
        )}
      </main>

      <footer className="row-start-3 text-center text-gray-500 text-sm">
        &copy; 2024 Victor Loh Wai Kit
      </footer>
    </div>
  );
}
