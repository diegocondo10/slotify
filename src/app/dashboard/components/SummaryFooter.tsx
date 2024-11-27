import { DIAS } from "@/utils/date";
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
  const visibleDays = useMemo(
    () => DIAS.filter((dia) => !hiddenDays.includes(dia.value)),
    [hiddenDays]
  );

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `71px repeat(${visibleDays.length}, 1fr)`,
    }),
    [visibleDays.length]
  );

  return (
    <div className='grid-sumary-container' id='summary_toolbar' style={gridStyle}>
      {/* Encabezado fijo */}
      <div className='grid-sumary-item text-center py-2 px-0 mx-0'>
        <p className='p-0 m-0'>Atendidos</p>
      </div>

      {/* Renderizar días visibles */}
      {visibleDays.map((dia) => (
        <div className='grid-sumary-item flex flex-column justify-content-around' key={dia.value}>
          {Object.entries(summary[dia.value] || {}).map(
            ([statusCode, { color, textColor, total }]) => (
              <Tag
                key={`${dia.value}-${statusCode}`}
                className='text-left'
                style={{ backgroundColor: color, color: textColor }}>
                {total}
              </Tag>
            )
          )}
        </div>
      ))}
    </div>
  );
});

SummaryFooter.displayName = "SummaryFooter";

export default SummaryFooter;
