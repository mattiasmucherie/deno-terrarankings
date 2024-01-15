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
};
export const handler: Handlers<HomeProps, State> = {
  async GET(_req, ctx) {
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
  },
};

export default function Home(props: PageProps<HomeProps, State>) {
  return (
    <div className="mx-auto flex gap-6 max-w-screen-md flex-col justify-center">
      <div className="mx-auto text-center">
        <Landing />
        {props.state.token && (
          <div className="mx-auto">
            <LinkButton href="/auth/create">Create Room</LinkButton>
          </div>
        )}
        {props.data.allowedRooms.length > 0 && (
          <>
            <h2 className="text-md mb-3 font-sansman ">
              Rooms you have access to
            </h2>
            <RoomList rooms={props.data.allowedRooms} />
          </>
        )}
        {props.data.disallowedRooms.length > 0 && (
          <>
            <h2 className="text-md mb-3 font-sansman mt-4">
              Rooms you need a password to access
            </h2>
            <RoomList rooms={props.data.disallowedRooms} />
          </>
        )}
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
