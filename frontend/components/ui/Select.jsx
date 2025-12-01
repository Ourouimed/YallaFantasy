"use client";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Select({ className = "", value, onChange, options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom"); // top / bottom
  const ref = useRef();
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = dropdownRef.current?.offsetHeight || 0;

    if (rect.bottom + dropdownHeight > viewportHeight && rect.top > dropdownHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  }, [isOpen, options.length]);

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full border flex items-center justify-between border-gray-300 bg-white/5 p-3 rounded-lg text-left hover:border-third transition select-none"
      >
        <span className="text-sm text-gray-800">
          {options.find((o) => o.value === value)?.label || "Select…"}
        </span>
        <ChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

     
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-y-auto max-h-60 transition-all`}
          style={{
            top: dropdownPosition === "bottom" ? "100%" : "auto",
            bottom: dropdownPosition === "top" ? "100%" : "auto",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="p-3 text-sm cursor-pointer hover:bg-gray-100"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
