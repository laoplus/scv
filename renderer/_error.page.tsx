import React from "react";

export { Page };

function Page({ is404 }: { is404: boolean }) {
  if (is404) {
    return (
      <div className="my-12 text-center">
        <h1 className="mb-4 text-4xl">404 Page Not Found</h1>
        <p>This page could not be found.</p>
      </div>
    );
  } else {
    return (
      <div className="my-12 text-center">
        <h1 className="mb-4 text-4xl">500 Internal Server Error</h1>
        <p>Something went wrong.</p>
      </div>
    );
  }
}
