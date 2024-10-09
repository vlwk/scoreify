"use client";

import { DeleteMatch } from "./delete-match";

export default function MatchesList({ matches }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Match Scores</h2>

      <ul className="space-y-4">
        {matches.map((match) => (
          <li
            key={`${match.team1}-${match.team2}`}
            className="p-4 border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-medium text-gray-800">
                  {match.team1} vs {match.team2}
                </div>
                <div className="text-sm text-gray-600">
                  Score: {match.score1} - {match.score2}
                </div>
              </div>
              <DeleteMatch team1={match.team1} team2={match.team2} score1={match.score1} score2={match.score2} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
