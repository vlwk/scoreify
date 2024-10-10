"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { z } from "zod";

const sql = postgres("postgres://postgres:Cbvf4dEkSNuiG0b@zephyr-dev-db.fly.dev:5432/lohvicto", {
  ssl: "allow",
});

export async function clearAllData() {
    
  
    try {

        
      await sql.begin(async (trx) => {

        await trx`
        TRUNCATE TABLE matches
      `;

        await trx`
        TRUNCATE TABLE scoreboard
        `;

        await trx`
        TRUNCATE TABLE logs
        `;
      });
      // Revalidate and return success message

      revalidatePath("/");
      return { message: "Successfully cleared all data!" };
    } catch (e) {
      const error = e as Error;
      revalidatePath("/");
      return { message: `Error: ${error.message}` };
    }
  }

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
          const [team_name, registered_date, group_numberString] = line.split(" ");
  
          if (!regex.test(registered_date)) {
            throw new Error(`Invalid registration date for team ${team_name}`);
          }
  
          const group_number = parseInt(group_numberString, 10);
  
          if (isNaN(group_number) || group_number < 1 || group_number > 2) {
            throw new Error(`Invalid group number for team ${team_name}: must be 1 or 2`);
          }
  
          const existingTeams = await trx`
            SELECT team_name FROM scoreboard WHERE team_name = ${team_name}
          `;
          if (existingTeams.length > 0) {
            throw new Error(`Team ${team_name} already exists. Please choose another name.`);
          }
  
          const teamsInGroup = await trx`
            SELECT COUNT(*) FROM scoreboard WHERE group_number = ${group_number}
          `;
          if (teamsInGroup[0].count >= 6) {
            throw new Error(`Group ${group_number} is full. Maximum 6 teams are allowed.`);
          }
  
          await trx`
            INSERT INTO scoreboard (team_name, group_number, score, score_alt, total_goals, registered_date)
            VALUES (${team_name}, ${group_number}, 0, 0, 0, ${registered_date.slice(0, 2) + registered_date.slice(3, 5)})
          `;
  
        }
      });
  
      // Revalidate and return success message
      await sql`
      INSERT INTO logs (timestamp, type, contents, message)
      VALUES (NOW(), 'addTeams', ${data.teams_info}, 'Success')
        `;
      revalidatePath("/");
      return { message: "All teams added successfully!" };
    } catch (e) {
        const error = e as Error;
        await sql`
      INSERT INTO logs (timestamp, type, contents, message)
      VALUES (NOW(), 'addTeams', ${data.teams_info}, ${`Error: ${error.message}`})
        `;
      revalidatePath("/");
      return { message: `Error: ${error.message}` };
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
          let [team1_name, team2_name, team1_score, team2_score] = line.trim().split(" ");
          
          if (!team1_name || !team2_name || !team1_score || !team2_score) {
            throw new Error("Invalid match format. Please ensure all fields are present.");
          }
  
          if (team1_name === team2_name) {
            throw new Error("Teams cannot be the same!");
          }
  
          // If team1_name > team2_name, swap to maintain consistent ordering
          if (team1_name > team2_name) {
            [team1_name, team2_name] = [team2_name, team1_name]; 
            [team1_score, team2_score] = [team2_score, team1_score];
          }
  
          const team1_score_number = parseInt(team1_score, 10);
          const team2_score_number = parseInt(team2_score, 10);
  
          if (isNaN(team1_score_number) || isNaN(team2_score_number)) {
            throw new Error("Invalid score number: must be integers!");
          }
  
          // Check if the match already exists
          const existingMatches = await trx`
            SELECT team1_name, team2_name FROM matches WHERE team1_name = ${team1_name} AND team2_name = ${team2_name}
          `;
  
          if (existingMatches.length > 0) {
            throw new Error(`Match between ${team1_name} and ${team2_name} already exists.`);
          }
  
          // Check if both teams exist
          const team1Data = await trx`
            SELECT team_name, group_number
            FROM scoreboard
            WHERE team_name = ${team1_name}
          `;
          const team2Data = await trx`
            SELECT team_name, group_number
            FROM scoreboard
            WHERE team_name = ${team2_name}
          `;
  
          if (team1Data.length === 0 || team2Data.length === 0) {
            throw new Error(`One or both teams don't exist: ${team1_name}, ${team2_name}.`);
          }
  
          // Check if they are in the same group
          if (team1Data[0].group_number !== team2Data[0].group_number) {
            throw new Error(`${team1_name} and ${team2_name} are not in the same group.`);
          }
  
          // Insert match into 'matches' table
          await trx`
            INSERT INTO matches (team1_name, team2_name, team1_score, team2_score)
            VALUES (${team1_name}, ${team2_name}, ${team1_score_number}, ${team2_score_number})
          `;
  
          // Update scoreboard
          let pointsTeam1 = 0;
          let pointsTeam1Alt = 0;
          let pointsTeam2 = 0;
          let pointsTeam2Alt = 0;
  
          if (team1_score_number > team2_score_number) {
            pointsTeam1 = 3;
            pointsTeam1Alt = 5;
            pointsTeam2Alt = 1;
          } else if (team1_score_number < team2_score_number) {
            pointsTeam2 = 3;
            pointsTeam2Alt = 5;
            pointsTeam1Alt = 1;
          } else {
            pointsTeam1 = 1;
            pointsTeam2 = 1;
            pointsTeam1Alt = 3;
            pointsTeam2Alt = 3;
          }
  
          await trx`
            UPDATE scoreboard
            SET score = score + ${pointsTeam1}, score_alt = score_alt + ${pointsTeam1Alt}, total_goals = total_goals + ${team1_score_number} 
            WHERE team_name = ${team1_name}
          `;
  
          await trx`
            UPDATE scoreboard
            SET score = score + ${pointsTeam2}, score_alt = score_alt + ${pointsTeam2Alt}, total_goals = total_goals + ${team2_score_number}
            WHERE team_name = ${team2_name}
          `;
        }
      });
      await sql`
      INSERT INTO logs (timestamp, type, contents, message)
      VALUES (NOW(), 'addMatches', ${data.matches_info}, 'Success')
        `;
      revalidatePath("/");
      return { message: `Added matches successfully.` };
  
    } catch (e) {
        const error = e as Error;
        await sql`
      INSERT INTO logs (timestamp, type, contents, message)
      VALUES (NOW(), 'addMatches', ${data.matches_info}, ${`Error: ${error.message}`})
        `;
      revalidatePath("/");
      return { message: error.message || "Failed to add matches" };
    }
  }
  
  export async function deleteMatch(
    prevState: {
      message: string;
    },
    formData: FormData,
  ) {
    const schema = z.object({
      team1_name: z.string().min(1),
      team2_name: z.string().min(1),
      team1_score: z.string().min(1),
      team2_score: z.string().min(1),
    });
    const data = schema.parse({
      team1_name: formData.get("team1_name"),
      team2_name: formData.get("team2_name"),
      team1_score: formData.get("team1_score"),
      team2_score: formData.get("team2_score"),
    });

    const team1_name = data.team1_name;
    const team2_name = data.team2_name;
    const team1_score_number = parseInt(data.team1_score, 10);
    const team2_score_number = parseInt(data.team2_score, 10);
  
    try {

        await sql.begin(async (trx) => {
            

            let pointsTeam1 = 0;
            let pointsTeam1Alt = 0;
            let pointsTeam2 = 0;
            let pointsTeam2Alt = 0;
    
            if (team1_score_number > team2_score_number) {
                pointsTeam1 = 3;
                pointsTeam1Alt = 5;
                pointsTeam2Alt = 1;
            } else if (team1_score_number < team2_score_number) {
                pointsTeam2 = 3;
                pointsTeam2Alt = 5;
                pointsTeam1Alt = 1;
            } else {
                pointsTeam1 = 1;
                pointsTeam2 = 1;
                pointsTeam1Alt = 3;
                pointsTeam2Alt = 3;
            }
        
            // Update leaderboard for Team 1
            await trx`
              UPDATE scoreboard
              SET score = score - ${pointsTeam1}, score_alt = score_alt - ${pointsTeam1Alt}, total_goals = total_goals - ${team1_score_number}
              WHERE team_name = ${team1_name}
            `;
        
            // Update leaderboard for Team 2
            await trx`
              UPDATE scoreboard
              SET score = score - ${pointsTeam2}, score_alt = score_alt - ${pointsTeam2Alt}, total_goals = total_goals - ${team2_score_number}
              WHERE team_name = ${team2_name}
            `;

            await trx`
            DELETE FROM matches 
            WHERE team1_name = ${team1_name} AND team2_name = ${team2_name}
            `;
          });
    
        await sql`
        INSERT INTO logs (timestamp, type, contents, message)
        VALUES (NOW(), 'deleteMatches', ${`Match between ${team1_name} and ${team2_name}`}, 'Success')
        `;
      revalidatePath("/");
      return { message: `Deleted match successfully.` };
    } catch (e) {
        const error = e as Error;
        await sql`
        INSERT INTO logs (timestamp, type, contents, message)
        VALUES (NOW(), 'deleteMatches', ${`Match between ${team1_name} and ${team2_name}`}, ${`Error: ${error.message}`})
        `;
      revalidatePath("/");
      return { message: error.message || "Failed to delete match." };
    }
  }

  export async function editMatch(
    prevState: {
      message: string;
    },
    formData: FormData,
  ) {
    const schema = z.object({
      team1_name: z.string().min(1),
      team2_name: z.string().min(1),
      team1_score: z.string().min(1),
      team2_score: z.string().min(1),
      team1_score_new: z.string().min(1),
      team2_score_new: z.string().min(1),
    });
    const data = schema.parse({
      team1_name: formData.get("team1_name"),
      team2_name: formData.get("team2_name"),
      team1_score: formData.get("team1_score"),
      team2_score: formData.get("team2_score"),
      team1_score_new: formData.get("team1_score_new"),
      team2_score_new: formData.get("team2_score_new"),
    });

    const team1_name = data.team1_name;
    const team2_name = data.team2_name;
    const team1_score_number = parseInt(data.team1_score, 10);
    const team2_score_number = parseInt(data.team2_score, 10);
    const team1_score_new_number = parseInt(data.team1_score_new, 10);
    const team2_score_new_number = parseInt(data.team2_score_new, 10);
  
    try {

        await sql.begin(async (trx) => {
            

            let pointsTeam1 = 0;
            let pointsTeam1Alt = 0;
            let pointsTeam2 = 0;
            let pointsTeam2Alt = 0;
    
            if (team1_score_number > team2_score_number) {
                pointsTeam1 = 3;
                pointsTeam1Alt = 5;
                pointsTeam2Alt = 1;
            } else if (team1_score_number < team2_score_number) {
                pointsTeam2 = 3;
                pointsTeam2Alt = 5;
                pointsTeam1Alt = 1;
            } else {
                pointsTeam1 = 1;
                pointsTeam2 = 1;
                pointsTeam1Alt = 3;
                pointsTeam2Alt = 3;
            }

            let pointsTeam1_new = 0;
            let pointsTeam1Alt_new = 0;
            let pointsTeam2_new = 0;
            let pointsTeam2Alt_new = 0;
    
            if (team1_score_new_number > team2_score_new_number) {
                pointsTeam1_new = 3;
                pointsTeam1Alt_new = 5;
                pointsTeam2Alt_new = 1;
            } else if (team1_score_new_number < team2_score_new_number) {
                pointsTeam2_new = 3;
                pointsTeam2Alt_new = 5;
                pointsTeam1Alt_new = 1;
            } else {
                pointsTeam1_new = 1;
                pointsTeam2_new = 1;
                pointsTeam1Alt_new = 3;
                pointsTeam2Alt_new = 3;
            }
        
            // Update leaderboard for Team 1
            await trx`
              UPDATE scoreboard
              SET score = score - ${pointsTeam1} + ${pointsTeam1_new}, score_alt = score_alt - ${pointsTeam1Alt} + ${pointsTeam1Alt_new}, total_goals = total_goals - ${team1_score_number} + ${team1_score_new_number}
              WHERE team_name = ${team1_name}
            `;
        
            // Update leaderboard for Team 2
            await trx`
              UPDATE scoreboard
              SET score = score - ${pointsTeam2} + ${pointsTeam2_new}, score_alt = score_alt - ${pointsTeam2Alt} + ${pointsTeam2Alt_new}, total_goals = total_goals - ${team2_score_number} + ${team2_score_new_number}
              WHERE team_name = ${team2_name}
            `;

            await trx`
            UPDATE matches
            SET team1_score = ${team1_score_new_number}, team2_score = ${team2_score_new_number} 
            WHERE team1_name = ${team1_name} AND team2_name = ${team2_name}
            `;
          });
    
          await sql`
          INSERT INTO logs (timestamp, type, contents, message)
          VALUES (NOW(), 'editMatch', ${`Match between ${team1_name} and ${team2_name} from ${team1_score_number}-${team2_score_number} to ${team1_score_new_number}-${team2_score_new_number}`}, 'Success')
          `;
      revalidatePath("/");
      return { message: `Successfully edited match!` };
    } catch (e) {
        const error = e as Error;
        await sql`
          INSERT INTO logs (timestamp, type, contents, message)
          VALUES (NOW(), 'editMatch', ${`Match between ${team1_name} and ${team2_name} from ${team1_score_number}-${team2_score_number} to ${team1_score_new_number}-${team2_score_new_number}`}, ${`Error: ${error.message}`})
          `;
      revalidatePath("/");
      return { message: error.message || "Failed to edit match." };
    }
  }