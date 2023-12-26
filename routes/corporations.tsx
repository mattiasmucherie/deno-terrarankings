import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "./_middleware.ts";
import { getCorporationPlayStats } from "../utils/db.ts";
import CorporationTable from "../components/CorporationTable.tsx";
import Layout from "../components/Layout.tsx";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const corps = await getCorporationPlayStats(ctx.state.supabaseClient);
    return ctx.render({ ...ctx.state, corps });
  },
};
export default function Corporations(props: PageProps) {
  return (
    <div>
      <Layout isLoggedIn={!!props.state.token}>
        <CorporationTable data={props.data.corps} />
      </Layout>
    </div>
  );
}
