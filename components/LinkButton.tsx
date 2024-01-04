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
      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded group bg-gradient-to-br from-rust-500 to-rust-900"
      href={href}
    >
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-bunker-950 rounded group-hover:bg-opacity-0">
        {children}
      </span>
    </a>
  );
};
