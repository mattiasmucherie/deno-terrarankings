import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { getAllRooms } from "../utils/db.ts";
import { LinkButton } from "../components/LinkButton.tsx";
import { Landing } from "../components/Landing.tsx";
import { Room } from "@/utils/types/types.ts";
import { RoomList } from "@/components/RoomList.tsx";

type HomeProps = {
  allowedRooms: Room[];
  disallowedRooms: Room[];
  error?: string;
};
export const handler: Handlers<HomeProps, State> = {
  async GET(_req, ctx) {
    try {
      const rooms = await getAllRooms(ctx.state.supabaseClient);

      const [allowedRooms, disallowedRooms] = rooms.reduce<[Room[], Room[]]>(
        ([p, f], r) => {
          return ctx.state.session.has(`room-${r.id}`)
            ? [[...p, r], f]
            : [p, [...f, r]];
        },
        [[], []],
      );

      return ctx.render({ ...ctx.state, allowedRooms, disallowedRooms });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      // Optionally send error details to the user, or just a generic message
      return ctx.render({
        allowedRooms: [],
        disallowedRooms: [],
        error: "Failed to fetch room data :(",
      });
    }
  },
};
function RoomSection({ title, rooms }: { title: string; rooms: Room[] }) {
  if (rooms.length === 0) {
    return (
      <p className="text-md mb-3 font-sansman">
        There are currently no {title.toLowerCase()}.
      </p>
    );
  }

  return (
    <>
      <h2 className="text-md mb-3 font-sansman mt-4">{title}</h2>
      <RoomList rooms={rooms} />
    </>
  );
}

export default function Home(props: PageProps<HomeProps, State>) {
  return (
    <main className="mx-auto flex gap-6 max-w-screen-md flex-col justify-center">
      <Landing />
      <div className="mx-auto text-center">
        {props.state.token
          ? (
            <div className="my-4">
              <LinkButton href="/auth/create">Create a New Room</LinkButton>
            </div>
          )
          : (
            <div className="my-4">
              <h1 className="text-xl font-bold mb-5 font-sansman">
                Log in to Create or Join Rooms
              </h1>
              <LinkButton href="/login">Log In</LinkButton>
            </div>
          )}
        {props.data.error
          ? <p className="text-red-500 font-sansman">{props.data.error}</p>
          : (
            <>
              <RoomSection
                title="Accessible Rooms"
                rooms={props.data.allowedRooms}
              />
              <RoomSection
                title="Password-Protected Rooms"
                rooms={props.data.disallowedRooms}
              />
            </>
          )}
      </div>
    </main>
  );
}
