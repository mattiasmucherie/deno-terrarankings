import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "./_middleware.ts";
import { getCorporationPlayStats } from "../utils/db.ts";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    await getCorporationPlayStats(ctx.state.supabaseClient);
    return ctx.render({ ...ctx.state });
  },
};
export default function Corporations(props: PageProps) {
  return <div>Corporations</div>;
}
