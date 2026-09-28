import { publicEvents } from "../publicEvents";
export const onBeforePrerenderStart = () => {
    const eventIndex = [...new Set(publicEvents.map((e) => e.Event_CategoryIndex))];
    return eventIndex.map((i) => `/events/${i}`);
};
