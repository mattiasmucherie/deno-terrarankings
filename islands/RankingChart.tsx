import { Chart } from "$fresh_charts/island.tsx";
import { MatchDetails } from "@/utils/types/types.ts";
import { matchesUrl } from "$fresh/src/runtime/active_url.ts";
import { nameToColor } from "@/utils/nameToColor.ts";

interface RankingChartProps {
  matches: MatchDetails[];
}

type Dataset = {
  label: string;
  data: { x: number; y: number }[];
  fill: boolean;
  tension: number;
  borderColor: string;
};

type UserDatasets = {
  [key: string]: Dataset;
};
export default function RankingChart(props: RankingChartProps) {
  const allUsers = new Set<string>();
  props.matches.forEach((game) => {
    game.match_participants.forEach((participant) => {
      allUsers.add(participant.user!.name);
    });
  });
  const userDatasets: UserDatasets = {};
  Array.from(allUsers).forEach((userName) => {
    userDatasets[userName] = {
      label: userName,
      data: [],
      fill: false,
      tension: 0.5,
      borderColor: nameToColor(userName),
    };
  });

  props.matches.forEach((game) => {
    game.match_participants.forEach((participant) => {
      const dataset = userDatasets[participant.user!.name];
      if (dataset) {
        dataset.data.push({
          x: props.matches.findIndex((m) => m.id === game.id) + 1,
          y: participant.new_elo,
        });
      }
    });
  });

  const datasetsArray: Dataset[] = Object.values(userDatasets);

  return (
    <div>
      <Chart
        options={{
          responsive: true,
          showLine: true,
          maintainAspectRatio: true,
          aspectRatio: 1,
          scales: {
            y: { display: true },
          },
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
        canvas={{ style: { height: "1000px" } }}
        type="line"
        data={{
          labels: props.matches.map((_, i) => i + 1),
          datasets: datasetsArray,
        }}
        plugins={[{
          id: "custom-line",
          beforeDraw: (chart) => {
            const yAxis = chart.scales["y"];
            const xAxis = chart.scales["x"];
            const y = yAxis.getPixelForValue(1000);
            const ctx = chart.ctx;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(xAxis.left, y);
            ctx.lineTo(xAxis.right, y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red"; // or any color you prefer
            ctx.stroke();
            ctx.restore();
          },
        }]}
      />
    </div>
  );
}
