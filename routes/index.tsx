// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import { State } from "./_middleware.ts";
import { getAllRooms } from "../utils/db.ts";
import { LinkButton } from "../components/LinkButton.tsx";
import { Landing } from "../components/Landing.tsx";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const rooms = await getAllRooms(ctx.state.supabaseClient);
    ctx.state.rooms = rooms;
    return ctx.render({ ...ctx.state });
  },
};

export default function Home(props: PageProps) {
  return (
    <Layout isLoggedIn={props.data.token}>
      <div class=" px-5 mx-auto flex gap-6 max-w-screen-md flex-col justify-center">
        <div class="mx-auto text-center">
          <Landing />
          <h1 class="text-2xl font-bold mb-5 ">
            Choose a room to join
          </h1>
          <ul>
            {props.data.rooms.map((
              room: {
                id: string;
                created_at: string;
                name: string;
                users: any[];
              },
            ) => (
              <li>
                <a
                  href={`/join/${room.id}`}
                >
                  <div class="border border-amber-800 border-2 rounded p-3">
                    {room.name}{" "}
                    <span class="text-sm text-zinc-500">
                      {room.users.length} Players
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {!props.data.token && (
          <div class="mx-auto text-center">
            <h1 class="text-xl font-bold mb-5 ">
              Login to create a new room
            </h1>
            <LinkButton href="/login">Login</LinkButton>
          </div>
        )}
      </div>
    </Layout>
  );
}
