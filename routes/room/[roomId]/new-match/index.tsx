import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "@/routes/_middleware.ts";
import {
  createMatch,
  getCorporations,
  getMaps,
  getRoomWithUsers,
} from "@/utils/db.ts";
import { Corporation, Maps, RoomWithUsers } from "@/utils/types/types.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/index.ts";
import { MatchSubmission } from "@/islands/MatchSubmission.tsx";

interface NewMatchProps {
  roomWithUsers?: RoomWithUsers;
  corps?: Corporation[];
  maps?: Maps[];
  error?: string;
}

export const handler: Handlers<NewMatchProps, State> = {
  async GET(_req, ctx) {
    try {
      const roomWithUsers = await getRoomWithUsers(
        ctx.state.supabaseClient,
        ctx.params.roomId,
      );
      const corps = await getCorporations(ctx.state.supabaseClient);
      const maps = await getMaps(ctx.state.supabaseClient);

      return ctx.render({ ...ctx.state, roomWithUsers, corps, maps });
    } catch (error) {
      console.error("Error in GET handler:", error);
      const errorMessage = "An error occurred while fetching data.";
      return ctx.render({ ...ctx.state, error: errorMessage });
    }
  },
  async POST(req, ctx) {
    try {
      const roomsWithUser = await getRoomWithUsers(
        ctx.state.supabaseClient,
        ctx.params.roomId,
      );
      const json = await req.json();

      await createMatch(
        ctx.state.supabaseClient,
        ctx.params.roomId,
        json,
        roomsWithUser.users,
      );

      const headers = new Headers();
      headers.set("location", `/room/${ctx.params.roomId}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (err) {
      console.error("Error in POST handler:", err);
      let errMessage = err.message || "An error occurred";
      if (err instanceof z.ZodError) {
        errMessage = err.errors.map((e) => e.message).join(", ");
      }

      const errorMessage = encodeURIComponent(
        errMessage,
      );
      const headers = new Headers();
      headers.set(
        "location",
        `/room/${ctx.params.roomId}/new-match?error=${errorMessage}`,
      );
      return new Response(null, {
        status: 303,
        headers,
      });
    }
  },
};
export default function NewMatchPage(props: PageProps<NewMatchProps, State>) {
  const err = props.data.error;
  const postError = props.url.searchParams.get("error");
  const { maps, corps, roomWithUsers } = props.data;
  return (
    <>
      {maps && corps && roomWithUsers && (
        <MatchSubmission
          maps={maps}
          roomWithUsers={roomWithUsers}
          corps={corps}
        />
      )}
      {(err || postError) && (
        <span className="text-red-500">Error: {err || postError}</span>
      )}

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
