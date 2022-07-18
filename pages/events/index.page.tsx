import React from "react";
import { UnitIcon } from "../../components/UnitIcon";
import { onBeforeRender } from "./index.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ events }: PageProps) {
  return (
    <>
      <h1 className="mb-4 text-6xl uppercase">EVENT STORIES</h1>

      <div className="m-20 grid gap-px overflow-hidden rounded-lg bg-slate-200 shadow-md md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <a
            key={event.Key}
            id={`ev${event.Key}`}
            className="z-10 bg-white p-6"
            href={`/events/${event.Event_CategoryIndex}`}
          >
            <UnitIcon
              src="https://cdn.laoplus.net/formationicon/FormationIcon_BR_Khan_N.webp"
              alt={event.Event_CategoryName}
              className="mb-8 h-12 w-12 rounded-md"
              withInsetBorder={true}
            />
            <p className="mb-2 font-medium">
              Ev{event.Event_CategoryIndex} {event.Event_CategoryName}
            </p>
            <p className="text-sm text-slate-500">{event.Event_CategoryDesc}</p>
          </a>
        ))}
      </div>
    </>
  );
}
