import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const { data: rooms, error } = await ctx.state.supabaseClient
      .from("rooms")
      .select("*")
      .eq("id", ctx.params.roomId);
    ctx.state.rooms = rooms;
    const { data, err } = await ctx.state.supabaseClient
      .from("users")
      .select("*")
      .eq("room_id", ctx.params.roomId);
    ctx.state.users = data;
    return ctx.render({ ...ctx.state });
  },
};

export default function JoinRoomPage(props: PageProps) {
  const room = props.data.rooms[0];
  const createdAt = new Date(room.created_at);
  const users = props.data.users;

  return (
    <Layout isLoggedIn={props.data.token}>
      <div className="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        <h1>ROOM {room.name}</h1>
        <p>Created at {createdAt.toLocaleDateString()}</p>
        <h2 className="my-4">Users</h2>
        <ul>
          {users.map((user: any) => {
            return (
              <li>
                <span>{user.name}</span> <span>{user.elo_rating}</span>
              </li>
            );
          })}
        </ul>
        <a className="my-4" href={`/room/${props.params.roomId}/new-player`}>
          New Player
        </a>
        <a className="my-4" href={`/room/${props.params.roomId}/new-match`}>
          New Match
        </a>
      </div>
    </Layout>
  );
}
