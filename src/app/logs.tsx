"use client";

export default function Logs({ logs }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Logs</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Type</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Contents</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Message</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-300">
                <td className="px-4 py-2 text-gray-800">{log.type}</td>
                <td className="px-4 py-2 text-gray-600">{log.contents}</td>
                <td className="px-4 py-2 text-gray-600">{log.message}</td>
                <td className="px-4 py-2 text-gray-600">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
