import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { getAllRooms } from "../utils/db.ts";
import { LinkButton } from "../components/LinkButton.tsx";
import { Landing } from "../components/Landing.tsx";
import { Rooms } from "../utils/types/types.ts";

type HomeProps = {
  rooms: Rooms;
};
export const handler: Handlers<HomeProps, State> = {
  async GET(_req, ctx) {
    const rooms = await getAllRooms(ctx.state.supabaseClient);
    return ctx.render({ ...ctx.state, rooms });
  },
};

export default function Home(props: PageProps<HomeProps, State>) {
  return (
    <div className=" px-5 mx-auto flex gap-6 max-w-screen-md flex-col justify-center">
      <div className="mx-auto text-center">
        <Landing />
        <h2 className="text-md mb-3 font-sansman ">Choose a room to join</h2>
        <ul className="flex flex-col gap-2">
          {props.data.rooms.map((room) => (
            <li>
              <a href={`/join/${room.id}`} className="block">
                <div className="bg-gradient-to-r from-black-pearl-950 to-carnation-950 via-black-pearl-950 hover:from-black-pearl-950 hover:to-carnation-900 p-3 rounded shadow-lg border-2 border-carnation-900">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg font-sansman tracking-wide">
                      {room.name}
                    </span>
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
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

      {!props.state.token && (
        <div className="mx-auto text-center">
          <h1 className="text-xl font-bold mb-5 font-sansman ">
            Login to create a new room
          </h1>
          <LinkButton href="/login">Login</LinkButton>
        </div>
      )}
    </div>
  );
}
