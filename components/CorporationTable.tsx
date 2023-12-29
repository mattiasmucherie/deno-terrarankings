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
    <div className="p-4 text-fantasy-100 rounded">
      <h2 className="text-2xl font-bold mb-4 font-sansman">
        Corporations Statistics
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-fantasy-100">
          <thead className="text-xs text-fantasy-200 uppercase bg-black-pearl-900 rounded-lg font-sansman">
            <tr>
              <th scope="col" className="px-4 py-2">
                Name
              </th>
              <th scope="col" className="px-4 py-2">
                #
              </th>
              <th scope="col" className="px-4 py-2">
                <a href="https://en.wikipedia.org/wiki/Bayesian_inference">
                  Adjusted W/R
                </a>
              </th>
              <th scope="col" className="px-4 py-2">
                W/R
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-black-pearl-900 hover:bg-carnation-900"
              >
                <td className="px-4 py-3  ">{item.name}</td>
                <td className="px-4 py-3">{item.total_plays}</td>
                <td className="px-4 py-2">
                  {Math.round(item.adjustedWinRate)}%
                </td>
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
