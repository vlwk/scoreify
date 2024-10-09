"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { z } from "zod";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function addTeams(
    prevState: {
      message: string;
    },
    formData: FormData,
  ) {
    const schema = z.object({
      teams_info: z.string().min(1), // Accepts multi-line input
    });
  
    const parse = schema.safeParse({
      teams_info: formData.get("teams_info"),
    });
  
    if (!parse.success) {
      return { message: "Failed to add teams" };
    }
  
    const data = parse.data;
  
    // Split the multi-line string into an array of lines
    const teamLines = data.teams_info.split("\n").map(line => line.trim()).filter(line => line.length > 0);
  
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
  
    try {
      await sql.begin(async (trx) => {
        for (const line of teamLines) {
          const [team_name, registered, group_numberString] = line.split(" ");
  
          if (!regex.test(registered)) {
            throw new Error(`Invalid registration date for team ${team_name}`);
          }
  
          const group_number = parseInt(group_numberString, 10);
  
          if (isNaN(group_number) || group_number < 1 || group_number > 2) {
            throw new Error(`Invalid group number for team ${team_name}: must be 1 or 2`);
          }
  
          const existingTeams = await trx`
            SELECT team_name FROM teams WHERE team_name = ${team_name}
          `;
          if (existingTeams.length > 0) {
            throw new Error(`Team ${team_name} already exists. Please choose another name.`);
          }
  
          const teamsInGroup = await trx`
            SELECT COUNT(*) FROM teams WHERE group_number = ${group_number}
          `;
          if (teamsInGroup[0].count >= 6) {
            throw new Error(`Group ${group_number} is full. Maximum 6 teams are allowed.`);
          }
  
          // Insert into scoreboard and teams table atomically
          await trx`
            INSERT INTO scoreboard (team, group_number, score)
            VALUES (${team_name}, ${group_number}, 0)
          `;
  
          await trx`
            INSERT INTO teams (team_name, registered, group_number)
            VALUES (${team_name}, ${registered.slice(0, 2) + registered.slice(3, 5)}, ${group_number})
          `;
        }
      });
  
      // Revalidate and return success message
      revalidatePath("/");
      return { message: "All teams added successfully!" };
    } catch (e) {
      revalidatePath("/");
      return { message: `Error: ${e.message}` };
    }
  }
  

  export async function addMatches (
    prevState: {
      message: string;
    },
    formData: FormData,
  ) {
    const schema = z.object({
      matches_info: z.string().min(1),
    });
    
    const parse = schema.safeParse({
      matches_info: formData.get("matches_info"),
    });
  
    if (!parse.success) {
      return { message: "Failed to add match" };
    }
  
    const data = parse.data;
    
    // Split the match_info string into multiple lines
    const matchLines = data.matches_info.trim().split("\n");
    
    // Create a transaction block to make the operation atomic
    try {
      await sql.begin(async (trx) => {
        // Loop through each line and process the matches
        for (const line of matchLines) {
          var [team1, team2, score1, score2] = line.trim().split(" ");
          
          if (!team1 || !team2 || !score1 || !score2) {
            throw new Error("Invalid match format. Please ensure all fields are present.");
          }
  
          if (team1 === team2) {
            throw new Error("Teams cannot be the same!");
          }
  
          // If team1 > team2, swap to maintain consistent ordering
          if (team1 > team2) {
            [team1, team2] = [team2, team1]; 
            [score1, score2] = [score2, score1];
          }
  
          const score1_number = parseInt(score1, 10);
          const score2_number = parseInt(score2, 10);
  
          if (isNaN(score1_number) || isNaN(score2_number)) {
            throw new Error("Invalid score number: must be integers!");
          }
  
          // Check if the match already exists
          const existingMatches = await trx`
            SELECT team1, team2 FROM matches WHERE team1 = ${team1} AND team2 = ${team2}
          `;

          console.log(existingMatches);
  
          if (existingMatches.length > 0) {
            throw new Error(`Match between ${team1} and ${team2} already exists.`);
          }
  
          // Check if both teams exist
          const team1Data = await trx`
            SELECT team_name, group_number
            FROM teams
            WHERE team_name = ${team1}
          `;
          const team2Data = await trx`
            SELECT team_name, group_number
            FROM teams
            WHERE team_name = ${team2}
          `;
  
          if (team1Data.length === 0 || team2Data.length === 0) {
            throw new Error(`One or both teams don't exist: ${team1}, ${team2}.`);
          }
  
          // Check if they are in the same group
          if (team1Data[0].group_number !== team2Data[0].group_number) {
            throw new Error(`${team1} and ${team2} are not in the same group.`);
          }
  
          // Insert match into 'matches' table
          await trx`
            INSERT INTO matches (team1, team2, score1, score2)
            VALUES (${team1}, ${team2}, ${score1_number}, ${score2_number})
          `;
  
          // Update scoreboard
          let pointsTeam1 = 0;
          let pointsTeam2 = 0;
  
          if (score1_number > score2_number) {
            pointsTeam1 = 3;
          } else if (score1_number < score2_number) {
            pointsTeam2 = 3;
          } else {
            pointsTeam1 = 1;
            pointsTeam2 = 1;
          }
  
          await trx`
            UPDATE scoreboard
            SET score = score + ${pointsTeam1}
            WHERE team = ${team1}
          `;
  
          await trx`
            UPDATE scoreboard
            SET score = score + ${pointsTeam2}
            WHERE team = ${team2}
          `;
        }
      });
  
      revalidatePath("/");
      return { message: `Added matches successfully.` };
  
    } catch (e) {
      revalidatePath("/");
      return { message: e.message || "Failed to add matches" };
    }
  }
  
  export async function deleteMatch(
    prevState: {
      message: string;
    },
    formData: FormData,
  ) {
    const schema = z.object({
      team1: z.string().min(1),
      team2: z.string().min(1),
      score1: z.string().min(1),
      score2: z.string().min(1),
    });
    const data = schema.parse({
      team1: formData.get("team1"),
      team2: formData.get("team2"),
      score1: formData.get("score1"),
      score2: formData.get("score2"),
    });

    const team1 = data.team1;
    const team2 = data.team2;
    const score1 = parseInt(data.score1, 10);
    const score2 = parseInt(data.score2, 10);

    console.log(team1, team2, score1, score2);
  
    try {

        await sql.begin(async (trx) => {
            // Determine match winner and loser
            let pointsTeam1 = 0;
            let pointsTeam2 = 0;
        
            if (score1 > score2) {
              pointsTeam1 = 3; // Team 1 wins
            } else if (score1 < score2) {
              pointsTeam2 = 3; // Team 2 wins
            } else {
              pointsTeam1 = 1; // Draw
              pointsTeam2 = 1; // Draw
            }
        
            // Update leaderboard for Team 1
            await trx`
              UPDATE scoreboard
              SET score = score - ${pointsTeam1}
              WHERE team = ${team1}
            `;
        
            // Update leaderboard for Team 2
            await trx`
              UPDATE scoreboard
              SET score = score - ${pointsTeam2}
              WHERE team = ${team2}
            `;

            await trx`
            DELETE FROM matches 
            WHERE team1 = ${team1} AND team2 = ${team2}
            `;
          });
    

      revalidatePath("/");
      return { message: `Done` };
    } catch (e) {
      revalidatePath("/");
      return { message: "Oops" };
    }
  }