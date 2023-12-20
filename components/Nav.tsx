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
    <header class="bg-amber-600 h-[110px] sm:!h-[144px] w-full bg-cover bg-no-repeat relative">
      <div class="bg-[url('/raindrops-animate.svg')] bg-transparent w-full h-full absolute" />
      <nav class="w-11/12 h-24 max-w-5xl mx-auto flex items-center justify-between relative">
        <div class="text-3xl  ml-1 font-bold">
          <a href={"/"}>
            Terrrankings
          </a>
        </div>
        <ul class="flex gap-6">
          {loggedIn
            ? (
              loggedInMenus.map((menu) => (
                <li>
                  <a
                    href={menu.href}
                    class="text-zinc-900 hover:text-zinc-950 py-1"
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
                    class="text-zinc-900 hover:text-zinc-950 py-1"
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
