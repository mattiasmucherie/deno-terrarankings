import { type ComponentChildren, type JSX } from "preact";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren;
  variant?: "primary" | "secondary" | "outline";
}

export const Button = (
  { children, variant = "primary", disabled, ...rest }: ButtonProps,
) => {
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses =
        `bg-teal-800 text-mercury-50 border-teal-800 hover:rounded-2xl active:rounded-2xl focus:rounded-2xl
        ${
          disabled
            ? "bg-teal-400 text-mercury-200 border-teal-400 cursor-not-allowed"
            : ""
        }`;
      break;
    case "secondary":
      variantClasses =
        `bg-alizarin-crimson-500 text-mercury-50 border-alizarin-crimson-500 hover:rounded-2xl active:rounded-2xl focus:rounded-2xl
        ${
          disabled
            ? "bg-alizarin-crimson-400 text-mercury-200 border-alizarin-crimson-400 cursor-not-allowed"
            : ""
        }`;
      break;
    case "outline":
      variantClasses =
        `bg-transparent text-mercury-200 border-mercury-200 hover:rounded-2xl active:rounded-2xl focus:rounded-2xl
        ${
          disabled
            ? "text-mercury-400 border-mercury-400 cursor-not-allowed"
            : ""
        }`;
      break;
  }

  return (
    <button
      className={`my-2 px-6 py-2 w-fit font-semibold rounded-lg text-sm border-2 transition-[border-radius] duration-[400ms] ease-in-out ${variantClasses}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
