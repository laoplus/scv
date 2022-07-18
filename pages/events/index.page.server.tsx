import _ from "lodash";
import { publicEvents } from "./eventDetails.page.server";

export async function onBeforeRender() {
  const CharacterIcon = [
    {
      Event_Category: "Open_Event01",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_3P_Sowan_N.webp",
    },
    {
      Event_Category: "Open_Event02",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_PECS_Triaina_N.webp",
    },
    {
      Event_Category: "Open_Event03",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_DS_Baekto_N.webp",
    },
    {
      Event_Category: "Open_Event04",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_PECS_Circe_N.webp",
    },
    {
      Event_Category: "Open_Event05",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_DrM_NS1.webp",
    },
    {
      Event_Category: "Open_Event06",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_3P_Aurora_N.webp",
    },
    {
      Event_Category: "Open_Event07",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_PECS_HighElven_N.webp",
    },
    {
      Event_Category: "Open_Event08",
      CharacterIcon:
        "https://cdn.laoplus.net/original/formationicon/FormationIcon_BR_TomoeKIN_N.webp",
    },
    {
      Event_Category: "Open_Event09",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_PECS_Machina_N.webp",
    },
    {
      Event_Category: "Open_Event10",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_3P_Hirume_N.webp",
    },
    {
      Event_Category: "Open_Event11",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_Sleipnir_NS1.webp",
    },
    {
      Event_Category: "Open_Event12",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_DS_Angel_N.webp",
    },
    {
      Event_Category: "Open_Event13",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_JangHwa_N.webp",
    },
    {
      Event_Category: "Open_Event14",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_PECS_Mnemosyne_N.webp",
    },
    {
      Event_Category: "Open_Event15",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_DrM_NS2.webp",
    },
    {
      Event_Category: "Open_Event16",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_3P_ConstantiaS2_N.webp",
    },
    {
      Event_Category: "Open_Event17",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_Khan_N.webp",
    },
  ];

  const events = _.chain(publicEvents)
    .groupBy((c) => c.Event_Category)
    .toArray()
    .value()
    .map((c) => c[0])
    .map((c) => {
      const icon = CharacterIcon.find(
        (i) => i.Event_Category === c.Event_Category
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
