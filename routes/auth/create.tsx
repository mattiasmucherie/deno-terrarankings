import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import * as bcrypt from "$bcrypt";
import { State } from "../_middleware.ts";

export const handler: Handlers<unknown, State> = {
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
    <div className="my-5 px-2 md:px-5 mx-auto flex max-w-screen-md flex-col justify-center">
      <div className="max-w-lg mx-auto mb-4 p-6 bg-concrete-800 text-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Room Password Creation Guidelines
        </h2>
        <p className="text-concrete-300 mb-3">
          Please consider the following guidelines when creating a password for
          your private room:
        </p>
        <ul className="list-disc list-inside text-concrete-400">
          <li>Avoid sensitive or personal information in your password.</li>
          <li>Choose a password that's simple to remember and share.</li>
          <li>Do not reuse passwords from other accounts.</li>
          <li>Only share the password with trusted individuals.</li>
          <li>Remember, you are responsible for your password's security.</li>
        </ul>
        <p className="mt-4 text-concrete-300">
          By setting a password, you agree to these guidelines. We are not
          liable for any security breaches resulting from your password choices.
        </p>
      </div>

      <form method="post" className=" my-5 space-y-4">
        <div>
          <label htmlFor="roomName" className="sr-only">
            Enter room name
          </label>
          <input
            id="roomName"
            type="text"
            name="roomName"
            className="bg-bunker-950 border border-concrete-100 rounded-lg text-sm block w-full p-2.5 placeholder-concrete-100 text-concrete-100"
            placeholder="Enter room name"
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="roomPassword" className="sr-only">
            Enter room password
          </label>
          <input
            type="password"
            name="roomPassword"
            id="roomPassword"
            className="bg-bunker-950 border border-concrete-100 rounded-lg text-sm block w-full p-2.5 placeholder-concrete-100 text-concrete-100"
            placeholder="Enter room password"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 w-fit font-semibold rounded bg-transparent text-concrete-100 border border-concrete-100 "
        >
          Create
        </button>
      </form>
      {err && (
        <div className="bg-red-400 border-l-4 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{err}</p>
        </div>
      )}
    </div>
  );
}
