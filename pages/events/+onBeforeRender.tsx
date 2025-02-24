import { publicEvents } from "./details/+onBeforeRender";

export async function onBeforeRender() {
  const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;

  const CharacterIcon: Record<string, string> = {
    Open_Event01: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Sowan_N.webp`,
    Open_Event02: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_Triaina_N.webp`,
    Open_Event03: `${CDN_BASE_URL}/formationicon/FormationIcon_DS_Baekto_N.webp`,
    Open_Event04: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_Circe_N.webp`,
    Open_Event05: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_DrM_NS1.webp`,
    Open_Event06: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Aurora_N.webp`,
    Open_Event07: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_HighElven_N.webp`,
    Open_Event08: `${CDN_BASE_URL}/original/formationicon/FormationIcon_BR_TomoeKIN_N.webp`,
    Open_Event09: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_Machina_N.webp`,
    Open_Event10: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Hirume_N.webp`,
    Open_Event11: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Sleipnir_NS1.webp`,
    Open_Event12: `${CDN_BASE_URL}/formationicon/FormationIcon_DS_Angel_N.webp`,
    Open_Event13: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_JangHwa_N.webp`,
    Open_Event14: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_Mnemosyne_N.webp`,
    Open_Event15: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_DrM_NS2.webp`,
    Open_Event16: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_ConstantiaS2_N.webp`,
    Open_Event17: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Khan_N.webp`,
    Open_Event18: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Spriggan_NS1.webp`,
    Open_Event19: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_BlindPrincess_N.webp`,
    Open_Event20: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Alcyone_N.webp`,
    Open_Event22: `${CDN_BASE_URL}/formationicon/FormationIcon_DS_Sarena_N.webp`,
    Open_Event23: `${CDN_BASE_URL}/formationicon/FormationIcon_DS_Koyori_N.webp`,
    Open_Event25: `${CDN_BASE_URL}/original/formationicon/FormationIcon_3P_Jiseok_N.webp`,
  };

  const events = (() => {
    const map = new Map<string, (typeof publicEvents)[number]>();
    for (const item of publicEvents) {
      if (!map.has(item.Event_Category)) {
        map.set(item.Event_Category, item);
      }
    }
    return [...map.values()];
  })();
  const eventsWithIcon = events.map((c) => ({
    ...c,
    CharacterIcon: CharacterIcon[c.Event_Category],
  }));

  return {
    pageContext: {
      pageProps: {
        events: eventsWithIcon,
      },
    },
  };
}
