import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { setCookie } from "$std/http/cookie.ts";
import { emailSchema, passwordSchema } from "@/utils/validationSchemas.ts";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const email = emailSchema.parse(form.get("email"));
    const password = passwordSchema.parse(form.get("password"));

    const { data, error } = await ctx.state.supabaseClient.auth
      .signInWithPassword({ email, password });

    const headers = new Headers();
    if (data.session) {
      setCookie(headers, {
        name: "supaLogin",
        value: data.session?.access_token,
        maxAge: data.session.expires_in,
      });
    }

    let redirect = "/";
    if (error) {
      redirect = `/login?error=${error.message}`;
    }

    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function Login(props: PageProps) {
  const err = props.url.searchParams.get("error");

  return (
    <section>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div class="mx-auto">
          <h2 class="text-2xl font-bold mb-5 text-center">Login</h2>
        </div>

        <div class="w-full bg-bunker-900 rounded shadow md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            {err && (
              <div class="bg-red-700 border-l-4 p-4" role="alert">
                <p class="font-bold">Error</p>
                <p>{err}</p>
              </div>
            )}
            <form class="space-y-4 md:space-y-6" method="POST">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="border bg-bunker-950 border-concrete-800 sm:text-sm rounded focus:border-rust-600 block w-full p-2.5 focus:ring-rust-500"
                  placeholder="Enter email"
                  autoComplete="email"
                />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="border bg-bunker-950 border-concrete-800 sm:text-sm rounded focus:border-rust-600 block w-full p-2.5 focus:ring-rust-500"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                class="w-full text-white bg-concrete-600 hover:bg-concrete-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center "
              >
                Login In
              </button>
              <p class="text-sm font-light text-concrete-500 dark:text-concrete-300">
                Don't have an account yet?{" "}
                <a
                  href="/signup"
                  class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
