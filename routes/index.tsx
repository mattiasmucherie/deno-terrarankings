// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import { State } from "./_middleware.ts";
import { getAllRooms } from "../utils/db.ts";

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
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        <div class="mx-auto text-center">
          <h1 class="text-2xl font-bold mb-5">Choose a room to join</h1>
          <ul>
            {props.data.rooms.map((
              room: { id: string; created_at: string; name: string },
            ) => (
              <li>
                <a href={`/join/${room.id}`}>{room.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {!props.data.token && (
          <div class="mx-auto text-center">
            <h1 class="text-2xl font-bold mb-5">Login to create a new room</h1>
            <a
              href="/login"
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Login
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
