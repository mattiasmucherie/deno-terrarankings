import { CorporationData } from "../utils/types/types.ts";

interface CorporationTableProps {
  data: CorporationData[];
}

const CorporationTable = ({ data }: CorporationTableProps) => {
  return (
    <div className="p-2 text-concrete-100 rounded">
      <h2 className="text-2xl font-bold mb-4 font-sansman">
        Corporations Statistics
      </h2>
      <div className="">
        <table className="min-w-full text-sm text-left text-concrete-100">
          <thead className="text-xs text-concrete-200 bg-bunker-900 font-sansman sticky top-0">
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
                className="border-b border-bunker-900 hover:bg-rust-900"
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
