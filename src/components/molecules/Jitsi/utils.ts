/* disable-esliint */
export const importJitsiApi = (): Promise<void> =>
  new Promise(async (resolve) => {
    if (window.JitsiMeetExternalAPI) {
      resolve(window.JitsiMeetExternalAPI);
    } else {
      const head = document.getElementsByTagName("head")[0];
      const script = document.createElement("script");

      script.setAttribute("src", "https://8x8.vc/libs/external_api.min.js");
      script.async = true;

      head.addEventListener(
        "load",
        // eslint-disable-next-line
        function (event: any) {
          if (event.target.nodeName === "SCRIPT") {
            resolve(window.JitsiMeetExternalAPI);
          }
        },
        true
      );

      head.appendChild(script);
    }
  });
