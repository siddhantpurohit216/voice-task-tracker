import "./PriorityPicker.css";
import { useEffect, useRef, useState } from "react";
const PRIORITIES = [
  { label: "No priority" },
  { label: "Urgent", icon: "!" },
  { label: "High", icon: "📶" },
  { label: "Medium", icon: "📶" },
  { label: "Low", icon: "📶" }
];

 export default function PriorityPicker({ anchorRef, selected, onSelect, onClose }) {
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 5,
      left: rect.left
    });
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
      className="priority-dropdown"
      style={{ top: pos.top, left: pos.left }}
      onClick={(e) => e.stopPropagation()} 
    >

      {PRIORITIES.map((p) => (
        <div
          key={p.label}
          className={`dropdown-item ${selected === p.label ? "selected" : ""}`}
          onClick={() => onSelect(p.label)}
        >
          <span>{p.icon}</span>
          {p.label}
          {selected === p.label && <span className="tick">✔</span>}
        </div>
      ))}
    </div>
  );
}
