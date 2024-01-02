import { Handlers, PageProps } from "$fresh/server.ts";
import { emailSchema, passwordSchema } from "@/utils/validationSchemas.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const email = emailSchema.parse(form.get("email"));
    const password = passwordSchema.parse(form.get("password"));

    const { error } = await ctx.state.supabaseClient.auth.signUp({
      email,
      password,
    });

    const headers = new Headers();

    let redirect = "/";
    if (error) {
      redirect = `/signup?error=${error.message}`;
    }

    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function SignUp(props: PageProps) {
  const err = props.url.searchParams.get("error");

  return (
    <section>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div class="mx-auto">
          <h2 class="text-2xl font-bold mb-5 text-center">Create Account</h2>
        </div>

        <div class="w-full bg-black-pearl-900 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            {err && (
              <div class="bg-red-400 border-l-4 p-4" role="alert">
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
                  class="border bg-black-pearl-950 border-stone-800 sm:text-sm rounded-lg focus:border-carnation-600 block w-full p-2.5 focus:ring-carnation-500"
                  placeholder="Enter email"
                  autoComplete="username"
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
                  class="border bg-black-pearl-950 border-stone-800 sm:text-sm rounded-lg focus:border-carnation-600 block w-full p-2.5 focus:ring-carnation-500"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                class="w-full text-white bg-fantasy-600 hover:bg-fantasy-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign Up
              </button>
              <p class="text-sm font-light text-stone-500 dark:text-stone-300">
                Already have an account?{" "}
                <a
                  href="/login"
                  class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
