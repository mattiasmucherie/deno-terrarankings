import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import * as bcrypt from "$bcrypt";
import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const roomName = form.get("roomName") as string;
    const roomPassword = form.get("roomPassword") as string;
    const hash = bcrypt.hashSync(roomPassword);

    const { error } = await ctx.state.supabaseClient.from("rooms").insert([{
      name: roomName,
      hashed_password: hash,
    }]);

    const headers = new Headers();

    let redirect = "/";
    if (error) {
      if (error.code === "23505") {
        const errorExists = "A room with that name already exists.";
        redirect = `/auth/create?error=${errorExists}`;
      } else {
        redirect = `/auth/create?error=${error.message}`;
      }
    }

    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
export default function Create(props: PageProps) {
  const err = props.url.searchParams.get("error");

  return (
    <Layout isLoggedIn={true}>
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        <h1 class="text-2xl font-bold mb-5 text-center">
          This route is protected!
        </h1>
        <form method="post" class="space-y-4">
          <div>
            <label for="roomName" class="sr-only">
              Enter room name
            </label>
            <input
              id="roomName"
              type="text"
              name="roomName"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter room name"
            />
          </div>
          <div>
            <label for="roomPassword" class="sr-only">
              Enter room password
            </label>
            <input
              type="password"
              name="roomPassword"
              id="roomPassword"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter room password"
            />
          </div>
          <button
            type="submit"
            class="inline-block rounded-lg bg-red-500 px-5 py-3 text-sm font-medium text-white"
          >
            Create
          </button>
        </form>
        {err && (
          <div class="bg-red-400 border-l-4 p-4" role="alert">
            <p class="font-bold">Error</p>
            <p>{err}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
