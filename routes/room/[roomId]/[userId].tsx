import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "@/routes/_middleware.ts";
import { getMainRival, getUserLatestMatches } from "@/utils/db.ts";
import { LatestMatches, RivalStat } from "@/utils/types/types.ts";
import { UserMatchTable } from "@/components/UserMatchTable.tsx";
import { UserStats } from "@/components/UserStats.tsx";

type UserPageProps = {
  usersLatestMatches: LatestMatches[];
  rival: RivalStat;
  lang?: string;
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
    const lang = req.headers.get("Accept-Language")?.split(",")[0];
    return ctx.render({ ...ctx.state, usersLatestMatches, lang, rival });
  },
};
export default function UserPage(props: PageProps<UserPageProps, State>) {
  const usersLatestMatches = props.data.usersLatestMatches;

  return (
    <>
      <div>
        {usersLatestMatches.length > 0 && (
          <UserStats
            rival={props.data.rival}
            usersLatestMatches={usersLatestMatches}
          />
        )}
      </div>
      <div className="overflow-x-scroll py-2">
        {usersLatestMatches.length > 0 && (
          <UserMatchTable
            usersLatestMatches={usersLatestMatches}
            lang={props.data.lang}
          />
        )}
      </div>
    </>
  );
}
