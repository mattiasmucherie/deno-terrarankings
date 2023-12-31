import { asset } from "$fresh/src/runtime/utils.ts";

interface NavProps {
  loggedIn: boolean;
  roomId?: string;
}

export default function Nav({ loggedIn, roomId }: NavProps) {
  const loggedInMenus = [
    { name: "Create", href: "/auth/create" },
    { name: "Logout", href: "/logout" },
  ];

  const nonLoggedInMenus = [
    { name: "Login", href: "/login" },
    { name: "Signup", href: "/signup" },
  ];

  return (
    <header className="bg-midnight-950 h-[96px] w-full bg-cover bg-no-repeat relative text-concrete-100">
      <div
        alt="raindrops"
        className="bg-transparent bg-[url('/raindrops-animate.svg')] w-full h-full object-cover absolute bg-repeat"
      />
      <nav className="w-11/12 h-24 max-w-5xl mx-auto flex items-center justify-between relative ">
        <div className="text-2xl ml-1 font-bold font-sansman">
          <a href={"/"}>
            TerraRanking
          </a>
        </div>
        <ul className="flex gap-6">
          {loggedIn
            ? (
              loggedInMenus.map((menu) => (
                <li>
                  <a
                    href={menu.href}
                    className=" hover:underline py-1"
                  >
                    {menu.name}
                  </a>
                </li>
              ))
            )
            : roomId && (
              <li>
                <a
                  href={`/room/${roomId}`}
                  className="hover:underline py-1"
                >
                  Back to room
                </a>
              </li>
            )}
        </ul>
      </nav>
    </header>
  );
}
