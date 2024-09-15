import _ from "lodash-es";

import { publicEvents } from "./details/+onBeforeRender";

export async function onBeforeRender() {
  const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
  const CharacterIcon = [
    {
      Event_Category: "Open_Event01",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Sowan_N.webp`,
    },
    {
      Event_Category: "Open_Event02",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_Triaina_N.webp`,
    },
    {
      Event_Category: "Open_Event03",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_DS_Baekto_N.webp`,
    },
    {
      Event_Category: "Open_Event04",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_Circe_N.webp`,
    },
    {
      Event_Category: "Open_Event05",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_DrM_NS1.webp`,
    },
    {
      Event_Category: "Open_Event06",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Aurora_N.webp`,
    },
    {
      Event_Category: "Open_Event07",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_HighElven_N.webp`,
    },
    {
      Event_Category: "Open_Event08",
      CharacterIcon: `${CDN_BASE_URL}/original/formationicon/FormationIcon_BR_TomoeKIN_N.webp`,
    },
    {
      Event_Category: "Open_Event09",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_Machina_N.webp`,
    },
    {
      Event_Category: "Open_Event10",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Hirume_N.webp`,
    },
    {
      Event_Category: "Open_Event11",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Sleipnir_NS1.webp`,
    },
    {
      Event_Category: "Open_Event12",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_DS_Angel_N.webp`,
    },
    {
      Event_Category: "Open_Event13",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_JangHwa_N.webp`,
    },
    {
      Event_Category: "Open_Event14",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_Mnemosyne_N.webp`,
    },
    {
      Event_Category: "Open_Event15",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_DrM_NS2.webp`,
    },
    {
      Event_Category: "Open_Event16",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_ConstantiaS2_N.webp`,
    },
    {
      Event_Category: "Open_Event17",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Khan_N.webp`,
    },
    {
      Event_Category: "Open_Event18",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Spriggan_NS1.webp`,
    },
    {
      Event_Category: "Open_Event19",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_BlindPrincess_N.webp`,
    },
    {
      Event_Category: "Open_Event20",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Alcyone_N.webp`,
    },
    {
      Event_Category: "Open_Event22",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_DS_Sarena_N.webp`,
    },
    {
      Event_Category: "Open_Event23",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_DS_Koyori_N.webp`,
    },
    {
      Event_Category: "Open_Event25",
      CharacterIcon: `${CDN_BASE_URL}/original/formationicon/FormationIcon_3P_Jiseok_N.webp`,
    },
  ];

  const events = _.chain(publicEvents)
    .groupBy((c) => c.Event_Category)
    .toArray()
    .value()
    .map((c) => c[0])
    .map((c) => {
      const icon = CharacterIcon.find(
        (i) => i.Event_Category === c.Event_Category,
      )?.CharacterIcon;
      return {
        ...c,
        CharacterIcon: icon,
      };
    });

  return {
    pageContext: {
      pageProps: {
        events,
      },
    },
  };
}
