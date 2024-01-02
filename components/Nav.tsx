import { asset } from "$fresh/src/runtime/utils.ts";

interface NavProps {
  loggedIn: boolean;
}

export default function Nav({ loggedIn }: NavProps) {
  const loggedInMenus = [
    { name: "Create", href: "/auth/create" },
    { name: "Logout", href: "/logout" },
  ];

  const nonLoggedInMenus = [
    { name: "Login", href: "/login" },
    { name: "Signup", href: "/signup" },
  ];

  return (
    <header className="bg-carnation-900 h-[96px] w-full bg-cover bg-no-repeat relative text-fantasy-100">
      <img
        src={asset("/raindrops-animate.svg")}
        alt="raindrops"
        className="bg-transparent  h-full object-cover absolute"
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
            : (
              nonLoggedInMenus.map((menu) => (
                <li>
                  <a
                    href={menu.href}
                    className="hover:underline py-1"
                  >
                    {menu.name}
                  </a>
                </li>
              ))
            )}
        </ul>
      </nav>
    </header>
  );
}
