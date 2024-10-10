"use client";

interface ScoreboardEntry {
  team_name: string;
  group_number: number;
  registered_date: string;
  score: number;
  score_alt: number;
  total_goals: number;
}

interface ScoreboardEntryProps {
  scoreboard: ScoreboardEntry[];
}

export default function ScoreBoard({ scoreboard }: ScoreboardEntryProps) {
  const sortScoreboard = (data: ScoreboardEntry[]) => {
    return data.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.total_goals !== a.total_goals) return b.total_goals - a.total_goals;
      if (b.score_alt !== a.score_alt) return b.score_alt - a.score_alt;
      const dateA = new Date(
        `${a.registered_date.slice(2, 4)}-${a.registered_date.slice(0, 2)}-01`,
      );
      const dateB = new Date(
        `${b.registered_date.slice(2, 4)}-${b.registered_date.slice(0, 2)}-01`,
      );
      return dateA.getTime() - dateB.getTime();
    });
  };

  const group1Scoreboard = sortScoreboard(
    scoreboard.filter((row) => row.group_number === 1),
  );
  const group2Scoreboard = sortScoreboard(
    scoreboard.filter((row) => row.group_number === 2),
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Scoreboard</h2>

      <h3 className="text-xl font-semibold mb-2 text-gray-600">Group 1</h3>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Rank
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Team
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Group Number
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Registered Date
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Score
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Score Alt
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Total Goals
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {group1Scoreboard.map((row, index) => (
              <tr
                key={row.team_name}
                className={`hover:bg-gray-100 transition duration-300 ${index < 4 ? "bg-yellow-100" : ""}`}
              >
                <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 text-gray-800">{row.team_name}</td>
                <td className="px-4 py-2 text-gray-600">{row.group_number}</td>
                <td className="px-4 py-2 text-gray-600">
                  {row.registered_date.slice(0, 2) +
                    "/" +
                    row.registered_date.slice(2, 4)}
                </td>
                <td className="px-4 py-2 text-gray-600">{row.score}</td>
                <td className="px-4 py-2 text-gray-600">{row.score_alt}</td>
                <td className="px-4 py-2 text-gray-600">{row.total_goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold mb-2 text-gray-600">Group 2</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Rank
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Team
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Group Number
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Registered Date
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Score
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Score Alt
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Total Goals
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {group2Scoreboard.map((row, index) => (
              <tr
                key={row.team_name}
                className={`hover:bg-gray-100 transition duration-300 ${index < 4 ? "bg-yellow-100" : ""}`}
              >
                <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 text-gray-800">{row.team_name}</td>
                <td className="px-4 py-2 text-gray-600">{row.group_number}</td>
                <td className="px-4 py-2 text-gray-600">
                  {row.registered_date.slice(0, 2) +
                    "/" +
                    row.registered_date.slice(2, 4)}
                </td>
                <td className="px-4 py-2 text-gray-600">{row.score}</td>
                <td className="px-4 py-2 text-gray-600">{row.score_alt}</td>
                <td className="px-4 py-2 text-gray-600">{row.total_goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
