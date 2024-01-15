import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "@/routes/_middleware.ts";
import {
  createMatch,
  getCorporations,
  getMaps,
  getRoomWithUsers,
} from "@/utils/db.ts";
import { Corporation, Maps, RoomWithUsers } from "@/utils/types/types.ts";

function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

interface NewMatchProps {
  roomWithUsers: RoomWithUsers;
  corps: Corporation[];
  maps: Maps[];
}
export const handler: Handlers<NewMatchProps, State> = {
  async GET(_req, ctx) {
    const roomWithUsers = await getRoomWithUsers(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    const corps = await getCorporations(ctx.state.supabaseClient);
    const maps = await getMaps(ctx.state.supabaseClient);

    return ctx.render({ ...ctx.state, roomWithUsers, corps, maps });
  },
  async POST(req, ctx) {
    const roomsWithUser = await getRoomWithUsers(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    const form = await req.formData();
    try {
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
export default function NewMatchPage(props: PageProps<NewMatchProps, State>) {
  const err = props.url.searchParams.get("error");
  return (
    <>
      <h2 className="text-xl font-bold mb-5 font-sansman">New match</h2>
      <form
        method="post"
        className="flex flex-col  shadow-lg bg-gradient-to-br from-alizarin-crimson-900 via-cod-gray-950 to-cod-gray-950 rounded p-2"
      >
        <div className="flex flex-col gap-2 divide-y divide-mercury-500">
          {props.data.roomWithUsers.users.map(
            (user) => {
              return (
                <div className="py-3 flex flex-col gap-2 rounded p-2">
                  <input
                    name="userIds"
                    value={user.id}
                    type={"text"}
                    className={"hidden"}
                  />
                  <span className="font-bold text-xl font-sansman">
                    {user.name}
                  </span>
                  <div className="flex justify-between">
                    <label className="flex justify-between items-center">
                      <span className="sr-only">
                        Corporation
                      </span>
                      <select
                        name="corp"
                        className="bg-cod-gray-950 border border-cod-gray-900 rounded p-1 w-40 text-ellipsis text-sm"
                      >
                        <option value="">{"Select Corporation"}</option>
                        {props.data.corps.map((c) => {
                          return <option value={c.id}>{c.name}</option>;
                        })}
                      </select>
                    </label>
                    <label className="flex justify-between items-center border border-cod-gray-900 rounded ">
                      <span className="bg-cod-gray-900 p-1">VP</span>
                      <input
                        name="points"
                        className="bg-cod-gray-950 p-1 px-2 rounded"
                        pattern="[0-9]*"
                        type="number"
                        min="0"
                        max="250"
                      />
                    </label>
                  </div>
                </div>
              );
            },
          )}
          <label className="p-2 py-5 flex justify-between items-center">
            <span>Choose a map</span>
            <select
              name="map"
              className="bg-cod-gray-950 border border-cod-gray-900 rounded p-1 "
              required
            >
              <option value="">{"Select map"}</option>
              {props.data.maps.map((m) => {
                return (
                  <option className="bg-green-500" value={m.id}>
                    {m.name}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="p-2 py-5 flex justify-between items-center">
            <span className="">
              Choose a date
            </span>
            <input
              type="datetime-local"
              name="date"
              id="date"
              style={{ backgroundColor: "black" }}
              className="bg-cod-gray-950 border border-cod-gray-900 rounded p-1 "
              max={formatDateTimeLocal(new Date())}
              defaultValue={formatDateTimeLocal(new Date())}
            />
          </label>
        </div>

        <div className="flex justify-center divide-none">
          <button
            type="submit"
            className=" my-2 px-6 py-2 w-fit font-semibold rounded bg-transparent text-mercury-100 border-2 border-mercury-100 hover:bg-mercury-800 focus:bg-mercury-800"
          >
            Create match
          </button>
        </div>
      </form>
      {err && <span className="text-red-500">Error: {err}</span>}
      <details class="bg-cod-gray-950 py-4">
        <summary class="text-white text-lg font-semibold">
          How Game Submission Works
        </summary>
        <div class="text-gray-300 mt-2">
          <p>
            Submitting your game of Terraforming Mars is straightforward, but
            here are some key points to keep in mind:
          </p>
          <ul class="list-disc list-inside">
            <li>
              <strong>Chronological Order:</strong>{" "}
              All games must be submitted in the order they were played. This
              helps maintain the integrity of scoring and player progression.
            </li>
            <li>
              <strong>Date Display:</strong>{" "}
              While the date of the game is displayed, it's only for reference.
              It does not influence the Elo calculation or other statistical
              analyses.
            </li>
            <li>
              <strong>Permanent Record:</strong>{" "}
              Currently, submitted games cannot be deleted. Double-check your
              input to ensure accuracy, as it will permanently affect your and
              others' records.
            </li>
          </ul>
        </div>
      </details>
    </>
  );
}
