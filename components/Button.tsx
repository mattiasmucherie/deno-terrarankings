import { type ComponentChildren, type JSX } from "preact";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren;
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const Button = (
  { children, variant = "primary", disabled, isLoading = false, ...rest }:
    ButtonProps,
) => {
  const variantMap = {
    primary:
      `bg-teal-800 text-mercury-50 border-teal-800 hover:rounded-2xl active:rounded-2xl focus:rounded-2xl
      ${
        disabled
          ? "bg-teal-400 text-mercury-200 border-teal-400 cursor-not-allowed"
          : ""
      }`,
    secondary:
      `bg-alizarin-crimson-500 text-mercury-50 border-alizarin-crimson-500 hover:rounded-2xl active:rounded-2xl focus:rounded-2xl
      ${
        disabled
          ? "bg-alizarin-crimson-400 text-mercury-200 border-alizarin-crimson-400 cursor-not-allowed"
          : ""
      }`,
    outline:
      `bg-transparent text-mercury-100 border-mercury-100 hover:rounded-2xl active:rounded-2xl focus:rounded-2xl
      ${
        disabled
          ? "text-mercury-400 border-mercury-400 bg-cod-gray-400 cursor-not-allowed"
          : ""
      }`,
  };

  const variantClasses = variantMap[variant];

  const content = isLoading
    ? (
      <span class="loader inline-block relative w-4 h-4 rounded-full border-solid border-1 border-transparent border-t-white border-r-white">
      </span>
    )
    : children;

  return (
    <button
      className={`my-2 px-6 py-2 w-fit font-semibold rounded-lg text-sm border-2 transition-[border-radius] duration-[400ms] ease-in-out ${variantClasses}`}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
};
