/* disable-esliint */
import React, { useState, useEffect } from "react";
import { Props, JitsiMeetAPIOptions } from "./types";
//import * as Default from "./defaults";
import { importJitsiApi } from "./utils";
import { useFirebase } from "react-redux-firebase";
import { useUser } from "hooks/useUser";

import { JAAS_API_KEY, JAAS_TENANT } from "secrets";

const Jitsi: React.FC<Props> = (props: Props) => {
  const {
    // containerStyle,
    // frameStyle,
    // loadingComponent,
    onAPILoad,
    // onIframeLoad,
    domain = "8x8.vc",
    roomName,
    // password,
    // displayName,
    // config,
    interfaceConfig = {
      TOOLBAR_BUTTONS: [
        "microphone",
        "camera",
        "closedcaptions",
        "desktop",
        "fullscreen",
        "fodeviceselection",
        "profile",
        "info",
        "recording",
        "etherpad",
        "settings",
        "raisehand",
        "videoquality",
        "filmstrip",
        "shortcuts",
        "tileview",
        "help",
        "mute-everyone",
      ],
    },
    // noSSL,
    // //jwt, // uncomment
    // devices,
    // userInfo,
  } = { ...props }; //...Default.Props, ...props };

  //const [loading, setLoading] = useState(true);
  //const ref = useRef<HTMLDivElement | null>(null);

  //const Loader = loadingComponent || Default.Loader;

  const { user, profile } = useUser();
  //const { worldUsersById } = useWorldUsersById();
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  // eslint-disable-next-line
  const startConference = (JitsiMeetExternalAPI: any, token: any): void => {
    const options: JitsiMeetAPIOptions = {
      roomName, //:
      parentNode: document.querySelector("#meet"),
      // configOverwrite: config,
      interfaceConfigOverwrite: interfaceConfig,
      // noSSL,
      jwt: token,
      // onLoad: onIframeLoad,
      // devices,
      // userInfo,
    };

    // try {
    //console.log("interfaceConfig", interfaceConfig);

    // const token = GenerateToken({
    //   id: "4vbgwhgwt",
    //   name: "John",
    //   tenant: "vpaas-magic-cookie-5e484a36ea8f4b69861a97388a803c6e",
    //   kid: "vpaas-magic-cookie-5e484a36ea8f4b69861a97388a803c6e/f47a85",
    // });
    //const tokenStr: string = token?.toString();
    // console.log(token);

    // const options: JitsiMeetAPIOptions = {
    //   roomName,
    //   parentNode: ref.current,
    //   configOverwrite: config,
    //   interfaceConfigOverwrite: interfaceConfig,
    //   noSSL,
    //   jwt: token?.toString(),
    //   onLoad: onIframeLoad,
    //   devices,
    //   userInfo,
    // };

    const api = new JitsiMeetExternalAPI(domain, options);
    //userInfo: { displayName: "John" },
    // });
    // const api = new JitsiMeetExternalAPI(domain, options);

    if (!api) throw new Error("Failed to create JitsiMeetExternalAPI istance");

    if (onAPILoad) onAPILoad(api);

    // api.addEventListener("videoConferenceJoined", () => {
    //   setLoading(false);

    //   api.executeCommand("displayName", displayName);

    //   if (domain === Default.Props.domain && password)
    //     api.executeCommand("password", password);
    // });

    /**
     * If we are on a self hosted Jitsi domain, we need to become moderators before setting a password
     * Issue: https://community.jitsi.org/t/lock-failed-on-jitsimeetexternalapi/32060
     */
    //   api.addEventListener(
    //     "participantRoleChanged",
    //     (e: { id: string; role: string }) => {
    //       if (
    //         domain !== Default.Props.domain &&
    //         password &&
    //         e.role === "moderator"
    //       )
    //         api.executeCommand("password", password);
    //     }
    //   );
    // } catch (error) {
    //   console.error("Failed to start the conference", error);
    // }
  };

  useEffect(() => {
    (async () => {
      if (!user) return;
      // @ts-ignore
      const getTokn = firebase.functions().httpsCallable("jitsi-getJitsiToken");
      const response = await getTokn({
        id: user.uid,
        name: profile?.partyName || "Participant",
        email: user.email,
        avatar: "https://primedre.space" + profile?.pictureUrl || "",
        tenant: JAAS_TENANT, //"vpaas-magic-cookie-5e484a36ea8f4b69861a97388a803c6e",
        apikey: JAAS_API_KEY, //"vpaas-magic-cookie-5e484a36ea8f4b69861a97388a803c6e/f47a85",
      });
      setToken(response.data.token);
    })();
    // eslint-disable-next-line
  }, [firebase, user, profile, JAAS_API_KEY]);

  useEffect(() => {
    if (!token) return;
    importJitsiApi().then((jitsiApi) => {
      startConference(jitsiApi, token);
    });
    // eslint-disable-next-line
  }, [token]);

  return (
    <div id="meet" className="meet" />
    // <div
    //   id="react-jitsi-container"
    //   style={{ ...Default.ContainerStyle, ...containerStyle }}
    // >
    //   {loading && <Loader />}
    //   <div
    //     id="react-jitsi-frame"
    //     style={{ ...Default.FrameStyle(loading), ...frameStyle }}
    //     ref={ref}
    //   />
    // </div>
  );
};

export default Jitsi;
