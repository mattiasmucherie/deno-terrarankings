import { computed, signal } from "@preact/signals";
import { Corporation } from "@/utils/types/types.ts";
import { formatDateTimeLocal } from "@/utils/formattedDate.ts";

export const stage = signal<"player" | "stats" | "review">("player");
export const users = signal<MatchUser[]>([]);
export const matchMap = signal<{ id: string; name: string } | null>(null);
export const matchDate = signal<string>(formatDateTimeLocal(new Date()));
export const isMatchSubmitting = signal(false);

export interface MatchUser {
  userId: string;
  userName: string;
  points: number;
  corporation: { id: string; name: string } | null;
  money: number;
}

export interface Match {
  users: MatchUser[];
  map: { id: string; name: string; color: string | null } | null;
  datetime: string | null;
}

export const addUser = (user: { id: string; name: string }) => {
  users.value = [...users.value, {
    userId: user.id,
    userName: user.name,
    points: 0,
    corporation: null,
    money: 0,
  }];
};
export const removeUser = (userId: string) => {
  const newUsers = [...users.value];
  const index = newUsers.findIndex((user) => user.userId === userId);
  if (index !== -1) {
    newUsers.splice(index, 1);
  }
  users.value = newUsers;
};
export const setCorporationForUser = (
  userId: string,
  corporation: Omit<Corporation, "created_at">,
) => {
  const newUsers = [...users.value];
  const index = newUsers.findIndex((u) => u.userId === userId);
  if (index !== -1) {
    newUsers[index].corporation = {
      name: corporation.name!,
      id: corporation.id,
    };
    users.value = newUsers;
  }
};

export const setPointsForUser = (userId: string, points: string) => {
  const newUsers = [...users.value];
  const index = newUsers.findIndex((u) => u.userId === userId);
  if (index !== -1) {
    newUsers[index].points = Number(points);
    users.value = newUsers;
  }
};
export const setMoneyForUser = (userId: string, money: string) => {
  const newUsers = [...users.value];
  const index = newUsers.findIndex((u) => u.userId === userId);
  if (index !== -1) {
    newUsers[index].money = Number(money);
    users.value = newUsers;
  }
};

export const isMatchValid = computed(() =>
  !!(users.value.every((user) =>
    user.corporation !== null && user.points > 0
  ) &&
    matchMap.value?.id && matchDate.value) && !errorMessage.value
);

export const errorMessage = computed(() => {
  const corporationIds = users.value.filter((u) => u.corporation?.id).map((
    user,
  ) => user.corporation?.id);
  const uniqueCorporationIds = new Set(corporationIds);
  if (corporationIds.length !== uniqueCorporationIds.size) {
    return "You cannot choose the same corporation twice.";
  }
  return null;
});
