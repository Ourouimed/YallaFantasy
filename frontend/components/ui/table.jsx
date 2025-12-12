"use client";
export default function Table({ data, columns }) {
  console.log(data)
  if (!data || data.length === 0) {
    return <p className="text-center py-4">No data available</p>;
  }

  // Merge data keys + custom columns
  const keys = [
    ...Object.keys(data[0]),
    ...(columns ? Object.keys(columns).filter(k => !Object.keys(data[0]).includes(k)) : []),
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              {keys.map((k) => (
                <th key={k} className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                  {k}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                {keys.map((k) => (
                  <td key={k} className="px-4 py-2 whitespace-nowrap">
                    {columns && columns[k] ? columns[k](item[k], item) : item[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
