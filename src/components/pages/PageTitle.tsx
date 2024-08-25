import React from "react";

const PageTitle: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <p className='text-center my-5 text-5xl text-gray-600'>{children}</p>;
};

export default PageTitle;
