import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { newNameSchema } from "@/utils/validationSchemas.ts";
import { State } from "@/routes/_middleware.ts";

export const handler: Handlers<unknown, State> = {
  GET(_req, ctx) {
    return ctx.render({ ...ctx.state });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const playerName = newNameSchema.parse(form.get("playerName"));

    const { error } = await ctx.state.supabaseClient
      .from("users")
      .insert([
        {
          name: playerName,
          room_id: ctx.params.roomId,
        },
      ]);

    const headers = new Headers();
    let redirect = `/room/${ctx.params.roomId}`;
    if (error) {
      redirect =
        `/room/${ctx.params.roomId}/new-player?error=could not create new player`;
    }
    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function NewPlayerPage() {
  return (
    <div className="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
      <form method="post" className="flex flex-col gap-4 items-center">
        <div className="w-full">
          <label
            htmlFor="playerName"
            className="block mb-2 text-sm font-medium text-ivory"
          >
            New Player Name
          </label>
          <input
            id="playerName"
            type="name"
            name="playerName"
            className="bg-licorice border border-ivory rounded-lg text-sm block w-full p-2.5 placeholder-ivory text-ivory"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 w-fit font-semibold rounded-lg bg-transparent text-ivory border border-ivory"
        >
          Create New Player
        </button>
      </form>
    </div>
  );
}
