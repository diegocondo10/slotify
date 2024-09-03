import React from 'react';

type RecordItem =
  | { label: string | React.ReactNode; value: string | React.ReactNode }
  | [string | React.ReactNode, string | React.ReactNode];

interface RecordDetailProps {
  items: RecordItem[];
  title?: string;
}

const RecordDetail: React.FC<RecordDetailProps> = ({ items, title }) => {
  return (
    <div className="grid mt-1">
      {title && (
        <div className="col-12">
          <div className="text-center text-xl font-bold">{title}</div>
        </div>
      )}
      {items.map((item, index) => {
        const [label, value] = Array.isArray(item) ? item : [item.label, item.value];
        return (
          <React.Fragment key={`${index}-${label?.toString()}`}>
            <div className="col-4 label text-right detail-grid-border flex flex-column">
              <div className="my-auto">{label}</div>
            </div>
            <div className="col-8 value detail-grid-border">{value}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RecordDetail;
