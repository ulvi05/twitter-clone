import { ReactNode } from "react";

type Props = {
  condition: boolean;
  children: ReactNode;
};

export const RenderIf = ({ children, condition }: Props) => {
  return condition ? <>{children}</> : null;
};
