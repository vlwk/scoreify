"use client";

import { useState } from "react";

export default function ScoreBoard({ scoreboard }) {

    const [filterGroup1, setFilterGroup1] = useState(true);
    const [filterGroup2, setFilterGroup2] = useState(true);
  
    const filteredScoreboard = scoreboard.filter(row => {
      if (row.group_number === 1 && !filterGroup1) return false;
      if (row.group_number === 2 && !filterGroup2) return false;
      return true;
    });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Scoreboard</h2>

      <div className="flex items-center mb-4">
        <div className="flex items-center mr-6">
          <input
            type="checkbox"
            id="group1"
            checked={filterGroup1}
            onChange={() => setFilterGroup1(!filterGroup1)}
            className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="group1" className="ml-2 text-gray-700">Group 1</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="group2"
            checked={filterGroup2}
            onChange={() => setFilterGroup2(!filterGroup2)}
            className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="group2" className="ml-2 text-gray-700">Group 2</label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Team</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Group Number</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">registered_date</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">score</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">score_alt</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">total_goals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredScoreboard.map((row) => (
              <tr key={row.team} className="hover:bg-gray-100 transition duration-300">
                <td className="px-4 py-2 text-gray-800">{row.team_name}</td>
                <td className="px-4 py-2 text-gray-600">{row.group_number}</td>
                <td className="px-4 py-2 text-gray-600">{row.registered_date.slice(0, 2) + '/' + row.registered_date.slice(2, 4)}</td>
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
