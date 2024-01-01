import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "./_middleware.ts";
import { getCorporationPlayStats } from "../utils/db.ts";
import CorporationTable from "../components/CorporationTable.tsx";
import Layout from "../components/Layout.tsx";
import { CorporationData } from "../utils/types/types.ts";

type CorporationsPage = {
  corps: CorporationData[];
};
export const handler: Handlers<CorporationsPage, State> = {
  async GET(_req, ctx) {
    const corps = await getCorporationPlayStats(ctx.state.supabaseClient);
    return ctx.render({ ...ctx.state, corps });
  },
};
export default function Corporations(
  props: PageProps<CorporationsPage, State>,
) {
  return (
    <div>
      <Layout isLoggedIn={!!props.state.token}>
        <CorporationTable data={props.data.corps} />
      </Layout>
    </div>
  );
}
