type Props = { colors: string[]; onPick?: (c:string)=>void; active?: string };
export default function ColorDots({ colors, active, onPick }: Props) {
  return (
    <div className="flex gap-2">
      {colors.map(c => (
        <button
          key={c}
          aria-label={c}
          onClick={() => onPick?.(c)}
          className={"h-7 w-7 rounded-full border-2 transition " +
            (active===c ? "scale-110 border-black/60" : "border-black/10 hover:scale-105")}
          style={{ background: c }}
        />
      ))}
    </div>
  );
}
