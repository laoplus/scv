import _ from "lodash";
import { publicEvents } from "./eventDetails.page.server";

export async function onBeforeRender() {
  const events = _.chain(publicEvents)
    .groupBy((c) => c.Event_Category)
    .toArray()
    .value()
    .map((c) => c[0]);

  console.log(events);

  return {
    pageContext: {
      pageProps: {
        events,
      },
    },
  };
}
