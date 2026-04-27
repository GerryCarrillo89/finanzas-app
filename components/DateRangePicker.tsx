"use client";

import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangePicker({ onChange }: { onChange: (range: any) => void }) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: any) => {
    setRange([ranges.selection]);
    onChange(ranges.selection);
  };

  return (
    <div className="relative w-full">
      <input
        readOnly
        onClick={() => setOpen(!open)}
        value={`${format(range[0].startDate, "yyyy-MM-dd")} → ${format(
          range[0].endDate,
          "yyyy-MM-dd"
        )}`}
        className="w-full border px-3 py-2 rounded cursor-pointer bg-white"
      />

      {open && (
        <div className="absolute z-50 mt-2 shadow-lg">
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={range}
            rangeColors={["#4f46e5"]}
          />
        </div>
      )}
    </div>
  );
}