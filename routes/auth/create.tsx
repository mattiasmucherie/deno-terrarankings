import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import * as bcrypt from "$bcrypt";
import { State } from "../_middleware.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/index.ts";
import { passwordSchema } from "../../utils/validationSchemas.ts";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const roomName = form.get("roomName") as string;
      const roomPassword = passwordSchema.parse(form.get("roomPassword"));

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
    } catch (e) {
      if (e instanceof z.ZodError) {
        return ctx.render({
          error: e.errors.map((e) => e.message).join(", "),
        });
      }
      return ctx.render({ error: e.message });
    }
  },
};
export default function Create(props: PageProps<{ error?: string }, State>) {
  const err = props.url.searchParams.get("error");

  return (
    <div className="my-5 px-2 md:px-5 mx-auto flex max-w-screen-md flex-col justify-center">
      <div className="max-w-lg mx-auto mb-4 p-6 bg-mercury-800 text-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Room Password Creation Guidelines
        </h2>
        <p className="text-mercury-300 mb-3">
          Please consider the following guidelines when creating a password for
          your private room:
        </p>
        <ul className="list-disc list-inside text-mercury-400">
          <li>Avoid sensitive or personal information in your password.</li>
          <li>Choose a password that's simple to remember and share.</li>
          <li>Do not reuse passwords from other accounts.</li>
          <li>Only share the password with trusted individuals.</li>
          <li>Remember, you are responsible for your password's security.</li>
        </ul>
        <p className="mt-4 text-mercury-300">
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
            className="bg-cod-gray-950 border border-mercury-100 rounded-lg text-sm block w-full p-2.5 placeholder-mercury-100 text-mercury-100"
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
            className="bg-cod-gray-950 border border-mercury-100 rounded-lg text-sm block w-full p-2.5 placeholder-mercury-100 text-mercury-100"
            placeholder="Enter room password"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 w-fit font-semibold rounded bg-transparent text-mercury-100 border border-mercury-100 "
        >
          Create
        </button>
      </form>
      {err && (
        <div className="text-red-500 pt-2" role="alert">
          <p>{err}</p>
        </div>
      )}
      {props.data?.error && (
        <div className="text-red-500 pt-2" role="alert">
          <p>{props.data.error}</p>
        </div>
      )}
    </div>
  );
}
