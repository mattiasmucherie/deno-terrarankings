import { CorporationData } from "../utils/types/types.ts";

interface CorporationTableProps {
  data: CorporationData[];
}

const TableRow = ({ item }: { item: CorporationData }) => (
  <tr className="border-b border-cod-gray-900">
    <td className="px-4 py-3">{item.name}</td>
    <td className="px-4 py-3">{item.total_plays}</td>
    <td className="px-4 py-2">{Math.round(item.adjustedWinRate)}%</td>
    <td className="px-4 py-2">{Math.round(item.winrate)}%</td>
  </tr>
);

const CorporationTable = ({ data }: CorporationTableProps) => {
  if (data.length === 0) {
    return (
      <div className="p-2 text-mercury-100 rounded">No data available.</div>
    );
  }

  return (
    <section className="p-2 text-mercury-100 rounded">
      <h2 className="text-2xl font-bold mb-4 font-sansman">
        Corporations Statistics
      </h2>
      <div className="">
        <table className="min-w-full text-sm text-left text-mercury-100">
          <thead className="text-xs text-mercury-200 bg-cod-gray-900 font-sansman sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-2">Name</th>
              <th scope="col" className="px-4 py-2">#</th>
              <th scope="col" className="px-4 py-2">
                <a
                  href="https://en.wikipedia.org/wiki/Bayesian_inference"
                  aria-label="Learn more about Adjusted Win Rate"
                >
                  Adjusted W/R
                </a>
              </th>
              <th scope="col" className="px-4 py-2">W/R</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => <TableRow item={item} />)}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CorporationTable;
