type Props =
  | {
      title?: string;
      description?: string;
    }
  | undefined;

export function createPageMeta(props: Props) {
  const title = props?.title || undefined;
  const description = props?.description || undefined;

  return {
    title: title ? title + " - SCV" : "SCV - Scene Viewer for Last Origin",
    description: [
      description,
      "SCVはラストオリジンのシーン・シナリオビューアです",
    ]
      .join(" ")
      .trim(),
  };
}
