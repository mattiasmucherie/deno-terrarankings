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
      <div className=" px-5 mx-auto flex gap-6 max-w-screen-md flex-col justify-center">
        <div className="mx-auto text-center">
          <Landing />
          <h1 class="text-2xl font-bold mb-5 ">
            Choose a room to join
          </h1>
          <ul class="flex flex-col gap-2">
            {props.data.rooms.map((
              room: {
                id: string;
                created_at: string;
                name: string;
                users: any[];
              },
            ) => (
              <li>
                <a href={`/join/${room.id}`} className="block">
                  <div className="bg-gradient-to-r from-engineeringOrange to-chocolateCosmos hover:from-engineeringOrange hover:to-flame p-3 rounded-lg shadow-lg transform transition-all duration-150">
                    <div className="flex justify-between items-center">
                      <span class="font-bold text-lg">{room.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {room.users.length} Players
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 transform transition duration-150 ease-in-out"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {!props.data.token && (
          <div className="mx-auto text-center">
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
