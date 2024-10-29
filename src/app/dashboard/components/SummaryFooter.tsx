import { Tag } from "primereact/tag";
import React, { useMemo } from "react";

interface SummaryItem {
  color: string;
  textColor: string;
  total: number;
}

interface SummaryFooterProps {
  summary: Record<string, Record<string, SummaryItem>>;
  hiddenDays: number[];
}

const SummaryFooter: React.FC<SummaryFooterProps> = React.memo(({ summary, hiddenDays }) => {
  const totalDays = useMemo(() => 7 - (hiddenDays?.length || 0), [hiddenDays]);

  const visibleSummaryEntries = useMemo(
    () => Object.entries(summary).filter(([day]) => !hiddenDays.includes(Number(day))),
    [summary, hiddenDays]
  );

  return (
    <div
      className='grid-sumary-container'
      id='summary_toolbar'
      style={{
        gridTemplateColumns: `71px repeat(${totalDays}, 1fr)`,
      }}>
      <div className='grid-sumary-item text-center py-2 px-0 mx-0'>
        <p className='p-0 m-0'>Atendidos</p>
      </div>
      {visibleSummaryEntries.map(([day, statuses]) => (
        <div className='grid-sumary-item flex flex-column justify-content-around' key={day}>
          {Object.entries(statuses).map(([statusCode, { color, textColor, total }]) => (
            <Tag
              key={`${day}-${statusCode}`}
              className='text-left'
              style={{ backgroundColor: color, color: textColor }}>
              {total}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  );
});

export default SummaryFooter;
