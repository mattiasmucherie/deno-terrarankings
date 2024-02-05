import { Corporation, Maps, RoomWithUsers } from "@/utils/types/types.ts";
import { FunctionalComponent } from "preact";

import { Button } from "@/components/Button.tsx";
import { formatDateTimeLocal, formattedDate } from "@/utils/formattedDate.ts";
import {
  addUser,
  errorMessage,
  isMatchSubmitting,
  isMatchValid,
  matchDate,
  matchMap,
  removeUser,
  setCorporationForUser,
  setMoneyForUser,
  setPointsForUser,
  stage,
  users,
} from "@/utils/matchSignals.ts";
import { getPositionEmoji } from "@/utils/getPositionEmoji.ts";

type MatchSubmissionProps = {
  roomWithUsers: RoomWithUsers;
  corps: Corporation[];
  maps: Maps[];
};

function hasSamePoints(userToCheck: any): boolean {
  return users.value.some((user) =>
    user.points !== 0 && user.userId !== userToCheck.userId &&
    user.points === userToCheck.points
  );
}

export const MatchSubmission: FunctionalComponent<MatchSubmissionProps> = (
  { maps, corps, roomWithUsers },
) => {
  return (
    <div>
      {stage.value === "player" &&
        (
          <div>
            <h2 className="text-lg font-sansman text-center">
              Select players who played in the game
            </h2>
            <ul className="flex flex-col gap-1">
              {roomWithUsers.users.map((u) => {
                return (
                  <li>
                    <label className="flex gap-3 text-lg items-center">
                      <input
                        className="accent-teal-400 scale-125"
                        type="checkbox"
                        name={u.id}
                        id={u.id}
                        checked={!!users.value.find((user) =>
                          u.id === user.userId
                        )}
                        onChange={(e) => {
                          if (e.currentTarget.checked) {
                            addUser({ id: u.id, name: u.name });
                          } else {
                            removeUser(u.id);
                          }
                        }}
                      />
                      <p>{u.name}</p>
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end">
              <Button
                variant="outline"
                disabled={users.value.length < 2}
                onClick={() => stage.value = "stats"}
              >
                Proceed to Scoring
              </Button>
            </div>
          </div>
        )}
      {stage.value === "stats" && (
        <div>
          <h2 className="text-lg font-sansman text-center">
            Enter match stats
          </h2>
          <div>
            {users.value.map((user) => {
              return (
                <div className="py-3 flex flex-col gap-2 rounded p-2">
                  <input
                    name="userIds"
                    value={user.userId}
                    type={"text"}
                    className={"hidden"}
                  />
                  <span className="font-bold text-xl font-sansman">
                    {user.userName}
                  </span>
                  <div className="flex justify-between">
                    <label className="flex justify-between items-center">
                      <span className="sr-only">
                        Corporation
                      </span>
                      <select
                        name="corp"
                        className="bg-cod-gray-950 border border-cod-gray-900 rounded p-1 w-40 text-ellipsis text-sm"
                        onChange={(e) => {
                          setCorporationForUser(user.userId, {
                            id: e.currentTarget.value,
                            name: e.currentTarget
                              .options[e.currentTarget.selectedIndex]
                              .text,
                          });
                        }}
                        value={user.corporation?.id || ""}
                      >
                        <option value="">{"Select Corporation"}</option>
                        {corps.map((c) => {
                          return <option value={c.id}>{c.name}</option>;
                        })}
                      </select>
                    </label>
                    <div className="flex flex-col gap-1">
                      <label className="flex justify-between items-center border border-cod-gray-900 rounded ">
                        <span className="bg-cod-gray-900 p-1">VP</span>
                        <input
                          name="points"
                          className="bg-cod-gray-950 p-1 px-2 rounded"
                          pattern="[0-9]*"
                          type="number"
                          min="0"
                          max="250"
                          value={user.points}
                          onChange={(e) => {
                            setPointsForUser(
                              user.userId,
                              e.currentTarget.value,
                            );
                          }}
                        />
                      </label>
                      {hasSamePoints(user) && (
                        <label className="flex justify-between items-center border border-cod-gray-900 rounded ">
                          <span className="bg-cod-gray-900 p-1">M€</span>
                          <input
                            name="money"
                            className="bg-cod-gray-950 p-1 px-2 rounded"
                            pattern="[0-9]*"
                            type="number"
                            min="0"
                            max="250"
                            value={user.money}
                            onChange={(e) => {
                              setMoneyForUser(
                                user.userId,
                                e.currentTarget.value,
                              );
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <label className="p-2 py-5 flex justify-between items-center border-t-2 border-mercury-500">
            <span>Choose a map</span>
            <select
              name="map"
              className="bg-cod-gray-950 border border-cod-gray-900 rounded p-1 "
              required
              value={matchMap.value?.id}
              onChange={(e) => {
                matchMap.value = {
                  name: e.currentTarget
                    .options[e.currentTarget.selectedIndex]
                    .text,
                  id: e.currentTarget.value,
                };
              }}
            >
              <option value="">{"Select map"}</option>
              {maps?.map((m) => {
                return (
                  <option className="bg-green-500" value={m.id}>
                    {m.name}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="p-2 py-5 flex justify-between items-center">
            <span className="">
              Choose a date
            </span>
            <input
              type="datetime-local"
              name="date"
              id="date"
              style={{ backgroundColor: "black" }}
              className="bg-cod-gray-950 border border-cod-gray-900 rounded p-1 "
              max={formatDateTimeLocal(new Date())}
              value={matchDate}
              onChange={(e) => {
                matchDate.value = e.currentTarget.value;
              }}
            />
          </label>
          <span className="text-red-500">{errorMessage}</span>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => stage.value = "player"}
            >
              Back to Players
            </Button>
            <Button
              variant="outline"
              disabled={!isMatchValid.value}
              onClick={() => stage.value = "review"}
            >
              Proceed to Review
            </Button>
          </div>
        </div>
      )}
      {stage.value === "review" && (
        <>
          <h2 className="text-lg font-sansman text-center">
            Review the scores before submitting
          </h2>
          <div className="border border-alizarin-crimson-950 shadow-lg bg-gradient-to-br from-alizarin-crimson-900 via-cod-gray-950 to-cod-gray-950 p-4 my-2 flex flex-col rounded-xl">
            <div className="flex justify-between">
              <time
                className="text-xs font-medium px-2.5 py-0.5 rounded bg-alizarin-crimson-700 text-mercury-100 w-fit mb-4 self-start"
                dateTime={new Date(matchDate.value).toISOString()}
              >
                {formattedDate(
                  new Date(matchDate.value),
                  window.navigator.language,
                )}
              </time>
              {matchMap.value?.id &&
                (
                  <p
                    className="text-xs font-medium px-2.5 py-0.5 rounded text-mercury-100 w-fit mb-4 self-start font-sansman"
                    style={{
                      backgroundColor: maps.find((m) =>
                        m.id === matchMap.value?.id
                      )?.color ?? "inherit",
                    }}
                  >
                    {matchMap.value.name}
                  </p>
                )}
            </div>
            {users.value.toSorted((a, b) => {
              if (a.points !== b.points) {
                return b.points - a.points;
              }
              return b.money - a.money;
            }).map(
              (u, i) => {
                return (
                  <div className="flex flex-no-wrap gap-2 items-baseline">
                    <span className="shrink-0">{getPositionEmoji(i)}</span>
                    <div className="grow flex flex-col">
                      <span className="font-semibold col-span-2">
                        {u.userName}
                      </span>
                      <span className="col-span-3 col-start-2 row-start-2 font-light text-xs text-mercury-300">
                        {u.corporation?.name ?? "Unknown Corporation"}
                      </span>
                    </div>

                    <span className="font-normal text-xs text-mercury-300 shrink-0">
                      {u.points} VP
                    </span>
                  </div>
                );
              },
            )}
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => stage.value = "stats"}
            >
              Back to Scoring
            </Button>
            <Button
              variant="primary"
              disabled={!isMatchValid.value || isMatchSubmitting.value}
              onClick={async () => {
                try {
                  isMatchSubmitting.value = true;
                  const res = await fetch("", {
                    method: "POST",
                    body: JSON.stringify({ users, matchMap, matchDate }),
                  });
                  if (res.ok) {
                    window.location.href = res.url;
                  }
                } finally {
                  isMatchSubmitting.value = false;
                }
              }}
              isLoading={isMatchSubmitting.value}
            >
              Submit Match
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
