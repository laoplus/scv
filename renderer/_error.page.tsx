import React from "react";
import { Heading } from "../components/Heading";

export { Page };

function Page({ is404 }: { is404: boolean }) {
  if (is404) {
    return (
      <div className="my-12 flex flex-col gap-4 px-2 text-center">
        <img
          src="https://lo.swaytwig.com/assets/webp/sticker/Manme03_3.webp"
          className="m-auto h-36 w-36"
        />
        <Heading level={1} classname="px-0 py-0">
          404 Page Not Found
        </Heading>
        <p>This page no longer exists, may have been deleted or moved.</p>
      </div>
    );
  } else {
    return (
      <div className="my-12 flex flex-col gap-4 px-2 text-center">
        <img
          src="https://lo.swaytwig.com/assets/webp/sticker/Diyap07_1.webp"
          className="m-auto h-36 w-36"
        />
        <Heading level={1} classname="px-0 py-0">
          500 Internal Server Error
        </Heading>
        <p>Something went wrong.</p>
      </div>
    );
  }
}
