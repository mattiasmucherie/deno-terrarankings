interface GameStat {
  id: string;
  name: string;
  total_plays: number;
  winrate: number;
}

interface CorporationTableProps {
  data: GameStat[];
}

const CorporationTable = ({ data }: CorporationTableProps) => {
  return (
    <div className="p-4 bg-stone-800 text-ivory rounded-md">
      <h2 className="text-2xl font-bold mb-4">Corporations Statistics</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-stone-400">
          <thead className="text-xs text-stone-100 uppercase bg-stone-700 rounded-lg">
            <tr>
              <th scope="col" className="px-4 py-2">
                Name
              </th>
              <th scope="col" className="px-4 py-2">
                Total Plays
              </th>
              <th scope="col" className="px-4 py-2">
                Winrate
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-stone-700 hover:bg-stone-600"
              >
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.total_plays}</td>
                <td className="px-4 py-2">
                  {Math.round(item.winrate)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorporationTable;
