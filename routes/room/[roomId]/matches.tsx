import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import { fetchMatchDetails, Matches } from "../../../utils/db.ts";
import { MatchCard } from "../../../components/MatchCard.tsx";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const matches = await fetchMatchDetails(
      ctx.state.supabaseClient,
      ctx.params.roomId,
      false,
    );
    return ctx.render({ ...ctx.state, matches });
  },
};

export default function MatchPage(props: PageProps) {
  return (
    <Layout isLoggedIn={props.data.token}>
      <h2 className="font-semibold text-lg font-sansman">Matches</h2>
      {(props.data.matches as Matches).map((m) => <MatchCard match={m} />)}
    </Layout>
  );
}
