import { defineApp, type PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import { SITE_DESCRIPTION } from "@/utils/constants.ts";
import Layout from "@/components/Layout.tsx";
import { State } from "@/routes/_middleware.ts";
import Head from "@/components/Head.tsx";

export default defineApp<State>((_, ctx) => {
  return (
    <html lang="en" className="dark bg-cod-gray-950">
      <Head href={ctx.url.toString()}>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="stylesheet" href={asset("/styles.css")} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/enter-sansman"
          rel="stylesheet"
        />
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
