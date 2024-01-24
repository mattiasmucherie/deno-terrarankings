import type { ComponentChildren } from "preact";
import Nav from "./Nav.tsx";

interface LayoutProps {
  isLoggedIn: boolean;
  children: ComponentChildren;
  roomId?: string;
}

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Nav loggedIn={props.isLoggedIn} />
      <div className="p-4 mx-auto max-w-screen-md text-mercury-100 font-exo">
        {props.children}
      </div>
    </>
  );
}
