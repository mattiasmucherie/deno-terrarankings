import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import {
  createMatch,
  getCorporations,
  getMaps,
  getRoomWithUsers,
} from "@/utils/db.ts";
import { Corporation, Maps, RoomWithUsers } from "@/utils/types/types.ts";

interface ConfirmationPageProps {
  roomWithUsers: RoomWithUsers;
  corps: Corporation[];
  maps: Maps[];
}

export const handler: Handlers<ConfirmationPageProps, State> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const data = JSON.parse(
      decodeURIComponent(url.searchParams.get("data") || "[]"),
    );

    console.warn(data);
    const roomWithUsers = await getRoomWithUsers(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    const corps = await getCorporations(ctx.state.supabaseClient);
    const maps = await getMaps(ctx.state.supabaseClient);
    data.users.map((u) => {
      return { ...u, userName: null };
    });

    return ctx.render({ ...ctx.state, roomWithUsers, corps, maps, data });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    try {
      const roomsWithUser = await getRoomWithUsers(
        ctx.state.supabaseClient,
        ctx.params.roomId,
      );
      await createMatch(
        ctx.state.supabaseClient,
        ctx.params.roomId,
        form,
        roomsWithUser.users,
      );
    } catch (err) {
      const headers = new Headers();
      headers.set(
        "location",
        `/room/${ctx.params.roomId}/new-match?error=${err.message}`,
      );
      return new Response(null, {
        status: 303,
        headers,
      });
    }

    const headers = new Headers();
    headers.set("location", `/room/${ctx.params.roomId}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
export default function ConfirmationPage(
  props: PageProps<ConfirmationPageProps, State>,
) {
  return <div></div>;
}
