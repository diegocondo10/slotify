import React from 'react';

export const mapApiErrors = (messages: string[]): React.ReactNode[] => {
  return messages.map((children) => {
    return React.createElement('p', {
      key: children,
      children,
      className: 'p-0 m-0 text-justify',
    });
  });
};
