import { tables } from "../serverUtil";

export async function onBeforeRender() {
  const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
  const mainChapters = tables.chapters.filter((c) => c.GameModeType === 0);

  const CharacterIcon = [
    {
      Key: "Chapter_01N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_ConstantiaS2_N.webp`,
    },
    {
      Key: "Chapter_02N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Amy_N.webp`,
    },
    {
      Key: "Chapter_03N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Marie_N.webp`,
    },
    {
      Key: "Chapter_04N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_AGS_Aeda_N.webp`,
    },
    {
      Key: "Chapter_05N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Scathy_N.webp`,
    },
    {
      Key: "Chapter_06N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Labiata_N.webp`,
    },
    {
      Key: "Chapter_07N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_InvDragon_N.webp`,
    },
    {
      Key: "Chapter_08N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_LemonadeAlpha_N.webp`,
    },
    {
      Key: "Chapter_09N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_LemonadeGamma_N.webp`,
    },
    {
      Key: "Chapter_10N",
      CharacterIcon: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Vargr_N.webp`,
    },
  ];

  const chapters = mainChapters.map((c) => {
    const icon = CharacterIcon.find((i) => i.Key === c.Key)?.CharacterIcon;
    return {
      ...c,
      CharacterIcon: icon,
    };
  });

  return {
    pageContext: {
      pageProps: {
        chapters,
      },
    },
  };
}
