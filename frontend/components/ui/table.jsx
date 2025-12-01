"use client";
export default function Table({ data }) {
  const keys = Object.keys(data[0]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
            <thead>
                <tr>
                {keys.map((k) => (
                    <th
                    key={k}
                    className="px-4 py-3 text-left font-semibold"
                    >
                    {k}
                    </th>
                ))}
                </tr>
            </thead>

            <tbody>
                {data.map((item, i) => (
                <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                    {keys.map((k) => (
                    <td key={k} className="px-4 py-2">
                        {item[k]}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
    </table>
    </div>
    
  );
}
