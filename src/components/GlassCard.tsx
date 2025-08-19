import { type JSX, type PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  onClick?: () => void;
}>;
export default function GlassCard({ className="", children, as:Tag="div", ...rest }: Props) {
  return (
    <Tag
      className={
        "bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/10 " +
        "shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl " + className
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
