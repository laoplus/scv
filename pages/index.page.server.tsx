export async function onBeforeRender() {
  const buildDate = new Date().toISOString();

  return {
    pageContext: {
      pageProps: {
        buildDate,
      },
    },
  };
}
