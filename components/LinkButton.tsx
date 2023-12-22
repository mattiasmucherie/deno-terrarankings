import { type ComponentChildren, type JSX } from "preact";

interface LinkButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: ComponentChildren;
  href: string;
}
export const LinkButton = (
  { href, children }: LinkButtonProps,
) => {
  return (
    <a
      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-amber-500 to-red-400 group-hover:from-amber-500 group-hover:to-red-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-amber-800"
      href={href}
    >
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-zinc-900 rounded-md group-hover:bg-opacity-0">
        {children}
      </span>
    </a>
  );
};
