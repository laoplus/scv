import React from "react";
import { UnitIcon } from "../../components/UnitIcon";
import { onBeforeRender } from "./index.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ events }: PageProps) {
  return (
    <div className="md:mx-4 lg:mx-8">
      <h1 className="py-12 px-4 text-4xl font-extrabold tracking-tight text-gray-900 md:px-0">
        Event Stories
      </h1>

      <div className="grid gap-px overflow-hidden bg-slate-200 shadow sm:rounded-lg md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <a
            key={event.Key}
            id={`ev${event.Key}`}
            className="z-10 bg-white p-6"
            href={`/events/${event.Event_CategoryIndex}`}
          >
            <UnitIcon
              src={event.CharacterIcon}
              alt={event.Event_CategoryName}
              className="mb-7 h-12 w-12 rounded-md"
              borderClassName="rounded-md"
              withInsetBorder={true}
            />
            <p className="mb-2 font-bold">{event.Event_CategoryName}</p>
            <p className="text-sm text-slate-500">{event.Event_CategoryDesc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
