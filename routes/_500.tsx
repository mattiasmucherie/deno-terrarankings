import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function Error500Page({ error }: PageProps) {
  return (
    <>
      <Head>
        <title>500 internal error: {(error as Error).message}</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">500 - This is our fault</h1>
        <p class="my-4">
          500 internal error: {(error as Error).message}
        </p>
        <a href="/" class="underline">
          Sorry, something went wrong on our end, but try again by going back
          home
        </a>
      </div>
    </>
  );
}
