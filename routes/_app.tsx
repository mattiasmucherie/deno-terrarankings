import { type PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
export default function App({ Component }: PageProps) {
  return (
    <html lang="en" class="dark bg-black-pearl-950">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>deno-terraranking</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="dark">
        <Component />
      </body>
      <script type="text/javascript" src={asset("/ms.js")} defer></script>
    </html>
  );
}
