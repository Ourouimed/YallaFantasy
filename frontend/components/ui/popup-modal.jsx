'use client';
import { X } from "lucide-react";
import { Button } from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { closePopup } from "@/store/features/popup/popupSlice";
import * as Components from "@/components/popup-components";
import { useEffect, useRef } from "react";

export default function PopupModal() {
  const { title, component, isOpen, props } = useSelector(state => state.popup);
  const dispatch = useDispatch();
  const ref = useRef();
  const Component = component ? Components[component] : null;

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(closePopup());
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") dispatch(closePopup());
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 h-screen w-full top-0 left-0 bg-black/70 flex items-center justify-center p-5">
      <div ref={ref} className="w-full max-w-md max-h-screen bg-white rounded-md shadow-sm overflow-y-auto">
        <div className="p-3 border-b border-gray-300 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button onClick={() => dispatch(closePopup())} className='hover:bg-gray-300 aspect-square !p-2'>
            <X size={20} />
          </Button>
        </div>
        <div className="p-3">
          {Component ? <Component {...props} /> : null}
        </div>
      </div>
    </div>
  );
}
