// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_test from "./routes/api/test.ts";
import * as $auth_middleware from "./routes/auth/_middleware.ts";
import * as $auth_create from "./routes/auth/create.tsx";
import * as $corporations from "./routes/corporations.tsx";
import * as $index from "./routes/index.tsx";
import * as $join_roomId_ from "./routes/join/[roomId].tsx";
import * as $login from "./routes/login.tsx";
import * as $logout from "./routes/logout.tsx";
import * as $room_roomId_userId_ from "./routes/room/[roomId]/[userId].tsx";
import * as $room_roomId_index from "./routes/room/[roomId]/index.tsx";
import * as $room_roomId_matches from "./routes/room/[roomId]/matches.tsx";
import * as $room_roomId_new_match_index from "./routes/room/[roomId]/new-match/index.tsx";
import * as $room_roomId_new_match_preview from "./routes/room/[roomId]/new-match/preview.tsx";
import * as $room_roomId_new_player from "./routes/room/[roomId]/new-player.tsx";
import * as $room_middleware from "./routes/room/_middleware.ts";
import * as $signup from "./routes/signup.tsx";
import * as $MatchSubmission from "./islands/MatchSubmission.tsx";
import * as $RankingChart from "./islands/RankingChart.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/test.ts": $api_test,
    "./routes/auth/_middleware.ts": $auth_middleware,
    "./routes/auth/create.tsx": $auth_create,
    "./routes/corporations.tsx": $corporations,
    "./routes/index.tsx": $index,
    "./routes/join/[roomId].tsx": $join_roomId_,
    "./routes/login.tsx": $login,
    "./routes/logout.tsx": $logout,
    "./routes/room/[roomId]/[userId].tsx": $room_roomId_userId_,
    "./routes/room/[roomId]/index.tsx": $room_roomId_index,
    "./routes/room/[roomId]/matches.tsx": $room_roomId_matches,
    "./routes/room/[roomId]/new-match/index.tsx": $room_roomId_new_match_index,
    "./routes/room/[roomId]/new-match/preview.tsx":
      $room_roomId_new_match_preview,
    "./routes/room/[roomId]/new-player.tsx": $room_roomId_new_player,
    "./routes/room/_middleware.ts": $room_middleware,
    "./routes/signup.tsx": $signup,
  },
  islands: {
    "./islands/MatchSubmission.tsx": $MatchSubmission,
    "./islands/RankingChart.tsx": $RankingChart,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
