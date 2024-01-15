import { type ComponentChildren, type JSX } from "preact";

interface LinkButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: ComponentChildren;
  href: string;
  variant?: "primary" | "secondary";
}
export const LinkButton = (
  { href, children, variant = "primary" }: LinkButtonProps,
) => {
  return (
    <>
      {variant === "primary"
        ? (
          <a
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-xl bg-gradient-to-br from-teal-500 to-teal-900 px-5 py-2.5"
            href={href}
          >
            {children}
          </a>
        )
        : (
          <a
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-xl bg-gradient-to-br from-alizarin-crimson-500 to-alizarin-crimson-900 px-5 py-2.5"
            href={href}
          >
            {children}
          </a>
        )}
    </>
  );
};
