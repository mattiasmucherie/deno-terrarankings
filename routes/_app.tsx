import { defineApp, type PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import { SITE_DESCRIPTION } from "../utils/constants.ts";
import Layout from "../components/Layout.tsx";
import { State } from "./_middleware.ts";
import Head from "../components/Head.tsx";

export default defineApp<State>((_, ctx) => {
  return (
    <html lang="en" className="dark bg-bunker-950">
      <Head href={ctx.url.toString()}>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="stylesheet" href={asset("/styles.css")} />
      </Head>
      <body className="dark">
        <Layout isLoggedIn={!!ctx.state.token} roomId={ctx.params.roomId}>
          <ctx.Component />
        </Layout>
      </body>
      <script type="text/javascript" src={asset("/ms.js")} defer></script>
    </html>
  );
});
