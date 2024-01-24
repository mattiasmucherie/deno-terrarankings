interface NavProps {
  loggedIn: boolean;
}

export default function Nav({ loggedIn }: NavProps) {
  const loggedInMenus = [
    { name: "Logout", href: "/logout" },
  ];

  return (
    <header className="bg-gradient-to-b from-teal-950 via-cod-gray-950 to-cod-gray-950 h-[96px] w-full bg-cover bg-no-repeat relative text-mercury-200 font-exo">
      <div className="bg-transparent bg-[url('/raindrops-animate.svg')] w-full h-full object-cover absolute bg-repeat" />
      <nav className="w-11/12 h-24 max-w-5xl mx-auto flex items-center justify-between relative">
        <div className="text-4xl ml-1 font-bold font-sansman">
          <a href={"/"}>
            TerraRanking
          </a>
        </div>
        {loggedIn && (
          <ul className="flex gap-6 items-center">
            {loggedInMenus.map((menu, index) => (
              <li key={index}>
                <a href={menu.href} className="hover:underline py-1 text-sm">
                  {menu.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
