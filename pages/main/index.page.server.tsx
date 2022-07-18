import _ from "lodash";
import { tables } from "../serverUtil";

export async function onBeforeRender() {
  const mainChapters = tables.chapters.filter((c) => c.GameModeType === 0);

  const CharacterIcon = [
    {
      Key: "Chapter_01N",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_3P_ConstantiaS2_N.webp",
    },
    {
      Key: "Chapter_02N",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_Amy_N.webp",
    },
    {
      Key: "Chapter_03N",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_Marie_N.webp",
    },
    {
      Key: "Chapter_04N",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_AGS_Aeda_N.webp",
    },
    {
      Key: "Chapter_05N",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_Scathy_N.webp",
    },
    {
      Key: "Chapter_06N",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_3P_Labiata_N.webp",
    },
    {
      Key: "Chapter_07N",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_BR_InvDragon_N.webp",
    },
    {
      Key: "Chapter_08N",
      CharacterIcon:
        "https://cdn.laoplus.net/formationicon/FormationIcon_PECS_LemonadeAlpha_N.webp",
    },
    {
      Key: "Chapter_09N",
      CharacterIcon: "",
    },
  ];

  const chapters = mainChapters.map((c) => {
    const icon = CharacterIcon.find((i) => i.Key === c.Key)?.CharacterIcon;
    return {
      ...c,
      CharacterIcon: icon,
    };
  });

  console.log(chapters);
  return {
    pageContext: {
      pageProps: {
        chapters,
      },
    },
  };
}
