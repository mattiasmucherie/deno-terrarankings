import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { getRoomStats } from "../../../utils/db.ts";
import { State } from "../../_middleware.ts";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    await getRoomStats(ctx.state.supabaseClient, ctx.params.roomId);
    return ctx.render({ ...ctx.state });
  },
};
export default function Corporations(props: PageProps) {
  return <div>Corporations</div>;
}
