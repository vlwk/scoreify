"use client";

import { DeleteMatch } from "./delete-match";

export default function MatchesList({ matches }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Match Scores</h2>

      <ul className="space-y-4">
        {matches.map((match) => (
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
              <DeleteMatch team1_name={match.team1_name} team2_name={match.team2_name} team1_score={match.team1_score} team2_score={match.team2_score} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
