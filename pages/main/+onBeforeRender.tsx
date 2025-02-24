import { tables } from "../serverUtil";

export async function onBeforeRender() {
  const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
  const mainChapters = tables.chapters.filter((c) => c.GameModeType === 0);

  const CharacterIcon: Record<string, string> = {
    Chapter01: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_ConstantiaS2_N.webp`,
    Chapter02: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Amy_N.webp`,
    Chapter03: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Marie_N.webp`,
    Chapter04: `${CDN_BASE_URL}/formationicon/FormationIcon_AGS_Aeda_N.webp`,
    Chapter05: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Scathy_N.webp`,
    Chapter06: `${CDN_BASE_URL}/formationicon/FormationIcon_3P_Labiata_N.webp`,
    Chapter07: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_InvDragon_N.webp`,
    Chapter08: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_LemonadeAlpha_N.webp`,
    Chapter09: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_LemonadeGamma_N.webp`,
    Chapter10: `${CDN_BASE_URL}/formationicon/FormationIcon_BR_Vargr_N.webp`,
    Chapter11: `${CDN_BASE_URL}/original/formationicon/FormationIcon_PECS_LemonadeDelta_N.webp`,
    Chapter12: `${CDN_BASE_URL}/formationicon/FormationIcon_PECS_LemonadeBeta_N.webp`,
  };

  const chapters = (() => {
    const map = new Map<string, (typeof mainChapters)[number]>();
    for (const item of mainChapters) {
      if (!map.has(item.ChapterString)) {
        map.set(item.ChapterString, item);
      }
    }
    return [...map.values()];
  })();
  const chaptersWithIcon = chapters.map((c) => ({
    ...c,
    CharacterIcon: CharacterIcon[c.ChapterString],
  }));

  return {
    pageContext: {
      pageProps: {
        chapters: chaptersWithIcon,
      },
    },
  };
}
