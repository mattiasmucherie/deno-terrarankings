import { type ComponentChildren, type JSX } from "preact";

interface LinkButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: ComponentChildren;
  href: string;
  variant?: "primary" | "secondary" | "disabled";
}

export const LinkButton = ({
  href,
  children,
  variant = "primary",
  ...rest
}: LinkButtonProps) => {
  const baseClass =
    "inline-flex items-center justify-center overflow-hidden text-sm font-medium rounded-lg hover:rounded-2xl active:rounded-2xl focus:rounded-2xl px-5 py-2.5 transition-[border-radius] duration-[400ms] ease-in-out";
  let variantClass = "";

  switch (variant) {
    case "primary":
      variantClass = "bg-gradient-to-br from-teal-500 to-teal-900";
      break;
    case "secondary":
      variantClass =
        "bg-gradient-to-br from-alizarin-crimson-500 to-alizarin-crimson-900";
      break;
    case "disabled":
      variantClass =
        "bg-gradient-to-br from-cod-gray-400 to-cod-gray-900 cursor-not-allowed";
      break;
  }

  return (
    <a
      className={`${baseClass} ${variantClass}`}
      href={variant !== "disabled" ? href : undefined}
      aria-disabled={variant === "disabled"}
      {...rest}
    >
      {children}
    </a>
  );
};
