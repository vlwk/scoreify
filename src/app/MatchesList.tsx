"use client";

import { useState } from "react";
import { DeleteMatch } from "./delete-match";
import { EditMatch } from "./edit-match";

interface MatchEntry {
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team2_score: number;
}

interface MatchEntryProps {
  matches: MatchEntry[];
}

export default function MatchesList({ matches } : MatchEntryProps) {
  const [selectedTeam, setSelectedTeam] = useState("all"); // State for the selected team

  // Get unique team names for the dropdown
  const teams = Array.from(new Set(matches.flatMap(match => [match.team1_name, match.team2_name])));

  // Filter matches based on the selected team
  const filteredMatches = selectedTeam === "all"
    ? matches
    : matches.filter(
        match => match.team1_name === selectedTeam || match.team2_name === selectedTeam
      );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Match Scores</h2>
      
      {/* Dropdown to select team */}
      <div className="mb-4">
        <label htmlFor="team-select" className="block text-sm font-medium text-gray-700">Select Team:</label>
        <select
          id="team-select"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      {filteredMatches.length === 0 ? (
        <p className="text-gray-500">No matches found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredMatches.map((match) => (
            <li
              key={`${match.team1_name}-${match.team2_name}`}
              className="p-4 border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-medium text-gray-800">
                    {match.team1_name} vs {match.team2_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Score: {match.team1_score} - {match.team2_score}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <EditMatch
                    team1_name={match.team1_name}
                    team2_name={match.team2_name}
                    team1_score={match.team1_score}
                    team2_score={match.team2_score}
                  />
                  <DeleteMatch
                    team1_name={match.team1_name}
                    team2_name={match.team2_name}
                    team1_score={match.team1_score}
                    team2_score={match.team2_score}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
