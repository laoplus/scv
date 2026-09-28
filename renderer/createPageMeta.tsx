type Props =
    | {
          title?: string;
          description?: string;
      }
    | undefined;

export function createPageMeta(props: Props) {
    const title = props?.title;
    const description = props?.description;

    return {
        title: title ? title + " - SCV" : "SCV - Scene Viewer for Last Origin",
        description: [description, "SCVはラストオリジンのシーン・シナリオビューアです"]
            .join("\n")
            .trim(),
    };
}
