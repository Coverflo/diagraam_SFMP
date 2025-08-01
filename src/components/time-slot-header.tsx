import React from "react";

interface TimeSlotHeaderProps {
  title: string;
}

export const TimeSlotHeader: React.FC<TimeSlotHeaderProps> = ({ title }) => {
  return (
    <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-black text-[17px] mb-6">
      {title}
    </h2>
  );
};