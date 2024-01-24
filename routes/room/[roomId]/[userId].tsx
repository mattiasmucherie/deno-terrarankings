import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "@/routes/_middleware.ts";
import { getMainRival, getMaps, getUserLatestMatches } from "@/utils/db.ts";
import { LatestMatches, Maps, RivalStat } from "@/utils/types/types.ts";
import { UserMatchTable } from "../../../components/UserMatchTable.tsx";
import { UserStats } from "../../../components/UserStats.tsx";

type UserPageProps = {
  usersLatestMatches: LatestMatches[];
  rival: RivalStat;
  lang?: string;
  maps: Maps[];
};
export const handler: Handlers<UserPageProps, State> = {
  async GET(req, ctx) {
    const usersLatestMatches = await getUserLatestMatches(
      ctx.state.supabaseClient,
      ctx.params.userId,
    );
    const rival = await getMainRival(
      ctx.state.supabaseClient,
      ctx.params.userId,
    );
    const maps = await getMaps(ctx.state.supabaseClient);
    const lang = req.headers.get("Accept-Language")?.split(",")[0];
    return ctx.render({ ...ctx.state, usersLatestMatches, lang, rival, maps });
  },
};
export default function UserPage(props: PageProps<UserPageProps, State>) {
  const usersLatestMatches = props.data.usersLatestMatches;

  return (
    <>
      <div>
        <UserStats
          rival={props.data.rival}
          usersLatestMatches={usersLatestMatches}
          maps={props.data.maps}
        />
      </div>
      <div className="overflow-x-scroll py-2">
        {usersLatestMatches.length > 0 && (
          <UserMatchTable
            usersLatestMatches={usersLatestMatches}
            lang={props.data.lang}
            maps={props.data.maps}
          />
        )}
      </div>
    </>
  );
}
