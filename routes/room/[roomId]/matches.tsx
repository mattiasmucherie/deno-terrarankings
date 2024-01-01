import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import { fetchMatchDetails } from "../../../utils/db.ts";
import { MatchCard } from "../../../components/MatchCard.tsx";
import { MatchDetails } from "../../../utils/types/types.ts";

interface MatchPageProps {
  matches: MatchDetails[];
}
export const handler: Handlers<MatchPageProps, State> = {
  async GET(_req, ctx) {
    const matches = await fetchMatchDetails(
      ctx.state.supabaseClient,
      ctx.params.roomId,
      false,
    );
    return ctx.render({ ...ctx.state, matches });
  },
};

export default function MatchPage(props: PageProps<MatchPageProps, State>) {
  return (
    <Layout isLoggedIn={!!props.state.token}>
      <h2 className="font-semibold text-lg font-sansman">Matches</h2>
      {props.data.matches.map((m) => <MatchCard match={m} />)}
    </Layout>
  );
}
