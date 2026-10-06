import getToolsTheme from "./tools.style";
import { GuideNote, ToolsIntent } from "./tools.type";

interface GuideNotesProps {
  items: GuideNote[];
  intent?: ToolsIntent;
}

const GuideNotes = ({ items, intent = "accent" }: GuideNotesProps) => {
  const theme = getToolsTheme(intent);

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((note) => (
        <li
          key={note.title}
          className="flex items-start gap-4 rounded-2xl border border-neutral-700 bg-neutral-800/40 px-5 py-4.5"
        >
          <span className={`shrink-0 pt-0.5 ${theme.text}`}>{note.icon}</span>

          <div className="min-w-0 flex-1">
            <p className="font-main text-h4 text-neutral-50">{note.title}</p>
            <p className="mt-1.5 font-secondary text-subtext leading-relaxed text-neutral-100">
              {note.desc}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GuideNotes;
