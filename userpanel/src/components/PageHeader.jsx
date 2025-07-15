import React from "react";

const PageHeader = ({ name }) => {
  return (
    <header className="mb-8">
      <h1 className="text-xl font-semibold text-gray-800">Welcome, {name}!</h1>
      <p className="text-gray-500">AI-Driven Interviews, Hassle-Free Hiring</p>
    </header>
  );
};

export default PageHeader;
