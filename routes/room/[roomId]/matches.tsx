import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "../../_middleware.ts";
import { fetchMatchDetails } from "../../../utils/db.ts";
import { MatchCard } from "../../../components/MatchCard.tsx";
import { MatchDetails } from "../../../utils/types/types.ts";

interface MatchPageProps {
  matches: MatchDetails[];
  lang?: string;
}
export const handler: Handlers<MatchPageProps, State> = {
  async GET(req, ctx) {
    const matches = await fetchMatchDetails(
      ctx.state.supabaseClient,
      ctx.params.roomId,
      false,
    );
    const lang = req.headers.get("Accept-Language")?.split(",")[0];

    return ctx.render({ ...ctx.state, matches, lang });
  },
};

export default function MatchPage(props: PageProps<MatchPageProps, State>) {
  return (
    <>
      <h2 className="font-semibold text-lg font-sansman">Matches</h2>
      {props.data.matches.map((m) => (
        <MatchCard match={m} lang={props.data.lang} />
      ))}
    </>
  );
}
