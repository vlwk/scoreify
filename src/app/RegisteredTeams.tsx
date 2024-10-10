// RegisteredTeams.tsx
"use client";

import { useState } from "react";

interface TeamsEntry {
  team_name: string;
  registered_date: string;
  group_number: number;
}

interface TeamsEntryProps {
  teams: TeamsEntry[];
}

export default function RegisteredTeams({ teams } : TeamsEntryProps) {
  const [filterGroup1, setFilterGroup1] = useState(true);
  const [filterGroup2, setFilterGroup2] = useState(true);

  const filteredTeams = teams.filter(team => {
    if (team.group_number === 1 && !filterGroup1) return false;
    if (team.group_number === 2 && !filterGroup2) return false;
    return true;
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Registered Teams</h2>
      
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

      <ul className="space-y-4">
        {filteredTeams.map((team) => (
          <li 
            key={team.team_name} 
            className="p-4 border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition duration-300"
          >
            <div className="text-lg font-medium text-gray-800">Team Name: {team.team_name}</div>
            <div className="text-sm text-gray-600">Registered: {team.registered_date.slice(0, 2)}/{team.registered_date.slice(2, 4)}</div>
            <div className="text-sm text-gray-600">Group: {team.group_number}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
