import { Chart } from "$fresh_charts/island.tsx";
import { MatchDetails } from "@/utils/types/types.ts";
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
      tension: 0.3,
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
          aspectRatio: 1.5,
          scales: {
            x: {
              type: "linear",
              ticks: { precision: 0 },
              display: true,
              title: { display: true, text: "Game #" },
              grid: { color: "#48070a" },
            },
            y: {
              display: true,
              type: "linear",
              title: { display: true, text: "Elo" },
              grid: { color: "#48070a" },
            },
          },
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
        type="line"
        data={{
          labels: props.matches.map((_, i) => i + 1),
          datasets: datasetsArray,
        }}
      />
    </div>
  );
}
