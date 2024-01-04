import { Room } from "@/utils/types/types.ts";

interface RoomListProps {
  rooms: Room[];
}

export const RoomList = ({ rooms }: RoomListProps) => {
  return (
    <ul className="flex flex-col gap-2">
      {rooms.map((room) => (
        <li>
          <a href={`/join/${room.id}`} className="block">
            <div className="bg-gradient-to-r from-bunker-950 to-rust-950 via-bunker-950 hover:from-bunker-950 hover:to-rust-900 p-3 rounded shadow-lg border-2 border-rust-900">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg font-sansman tracking-wide">
                  {room.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {room.users.length} Players
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform transition duration-150 ease-in-out"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};
