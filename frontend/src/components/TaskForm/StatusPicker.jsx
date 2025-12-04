import { useEffect, useRef, useState } from "react";
import "./StatusPicker.css";

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];

export default function StatusPicker({ anchorRef, selected, onSelect, onClose }) {
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
  if (!anchorRef.current) return;
  const rect = anchorRef.current.getBoundingClientRect();
  setPos({ top: rect.bottom + 5, left: rect.left });
}, []);


  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="status-dropdown"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="dropdown-header">Set status…</div>

      {STATUS_OPTIONS.map((s) => (
        <div
          key={s}
          className={`dropdown-item ${selected === s ? "selected" : ""}`}
          onClick={() => onSelect(s)}
        >
          {s}
          {selected === s && <span className="tick">✔</span>}
        </div>
      ))}
    </div>
  );
}
