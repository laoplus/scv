import { tables } from "../serverUtil";

export async function onBeforeRender() {
  const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
  const mainChapters = tables.chapters.filter((c) => c.GameModeType === 0);

  const CharacterIcon: Record<string, string> = {
    Chapter_01N: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_ConstantiaS2_N.webp`,
    Chapter_02N: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Amy_N.webp`,
    Chapter_03N: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Marie_N.webp`,
    Chapter_04N: `${CDN_BASE_URL}/formationicon/FormationIcon_AGS_Aeda_N.webp`,
    Chapter_05N: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Scathy_N.webp`,
    Chapter_06N: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Labiata_N.webp`,
    Chapter_07N: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_InvDragon_N.webp`,
    Chapter_08N: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_LemonadeAlpha_N.webp`,
    Chapter_09N: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_LemonadeGamma_N.webp`,
    Chapter_10N: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Vargr_N.webp`,
    Chapter_11N: `${CDN_BASE_URL}/original/formationicon/FormationIcon_PECS_LemonadeDelta_N.webp`,
  };

  const chapters = mainChapters.map((c) => ({
    ...c,
    CharacterIcon: CharacterIcon[c.Key],
  }));

  return {
    pageContext: {
      pageProps: {
        chapters,
      },
    },
  };
}
