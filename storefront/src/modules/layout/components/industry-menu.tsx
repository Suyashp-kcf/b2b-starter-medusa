"use client"

import { useState } from "react"

const INDUSTRIES = [
  "APPAREL",
  "JEWELRY",
  "GROCERY",
  "CANNABIS",
  "FIREARMS",
  "AUTOMOTIVE",
  "THEME PARKS",
  "CONSUMABLES",
  "PHARMACY",
  "SMOKE & VAPE",
  "THRIFT",
]

export default function IndustryMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <button
        className="hover:text-ui-fg-base hover:bg-neutral-100 rounded-full px-3 py-2 font-semibold focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        tabIndex={0}
        type="button"
      >
        Industry
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
          <ul className="py-2 px-4 text-left">
            {INDUSTRIES.map((industry) => (
              <li
                key={industry}
                className="py-1 hover:underline cursor-pointer"
                tabIndex={-1}
              >
                {industry}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 