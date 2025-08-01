import React from "react";

interface LunchBreakProps {
  timeRange: string;
  text: string;
}

export const LunchBreak: React.FC<LunchBreakProps> = ({ timeRange, text }) => {
  return (
    <div className="w-full h-auto md:h-[62px] rounded-[7px] [background:linear-gradient(270deg,rgba(188,200,189,1)_0%,rgba(35,71,36,1)_100%)] flex flex-col md:flex-row items-center px-6 py-4 md:py-0 mb-8">
      <div className="[font-family:'Montserrat',Helvetica] font-bold text-white text-base">
        {timeRange}
      </div>
      <div className="[font-family:'Montserrat',Helvetica] font-bold text-white text-base mt-2 md:mt-0 md:ml-[180px] lg:ml-[340px]">
        {text}
      </div>
    </div>
  );
};