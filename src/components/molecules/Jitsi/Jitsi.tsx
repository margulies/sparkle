/* disable-esliint */
import React, { useState, useEffect } from "react";
import { Props, JitsiMeetAPIOptions } from "./types";
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
    config = {
      //etherpad_base: true,
      startWithAudioMuted: true,
      startWithVideoMuted: true,
      disableThirdPartyRequests: false,
      prejoinPageEnabled: false,
      enableUserRolesBasedOnToken: true,
      enableFeaturesBasedOnToken: true,
      enableWelcomePage: false,
      transcribingEnabled: true,
      deploymentUrls: {
        userDocumentationURL: "https://primedre.space/v/primedre",
      },
    },
    interfaceConfig = {
      LOCAL_THUMBNAIL_RATIO: 1.618 / 1,
      INITIAL_TOOLBAR_TIMEOUT: 5,
      TOOLBAR_TIMEOUT: 5,
      //TOOLBAR_ALWAYS_VISIBLE: false,
      DISPLAY_WELCOME_PAGE_CONTENT: false,
      VIDEO_LAYOUT_FIT: "both",
      CONNECTION_INDICATOR_DISABLED: true,
      VIDEO_QUALITY_LABEL_DISABLED: true,
      FILM_STRIP_MAX_HEIGHT: 100,
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
        //"etherpad",
        "settings",
        //"raisehand",
        //"videoquality",
        "filmstrip",
        "shortcuts",
        "tileview",
        "help",
        "mute-everyone",
        "info",
      ],
      SETTINGS_SECTIONS: ["moderator", "profile", "calendar", "devices"],
    },
    // noSSL,
    // jwt
    // devices,
    // userInfo,
  } = { ...props }; //...Default.Props, ...props };

  //const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  //const ref = useRef<HTMLDivElement | null>(null);

  //const Loader = loadingComponent || Default.Loader;

  const { user, profile } = useUser();
  //const { worldUsersById } = useWorldUsersById();
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  // eslint-disable-next-line
  const startConference = (JitsiMeetExternalAPI: any, token: any): void => {
    // try {
    const options: JitsiMeetAPIOptions = {
      roomName, //:
      parentNode: document.querySelector("#meet"),
      configOverwrite: config,
      interfaceConfigOverwrite: interfaceConfig,
      // noSSL,
      jwt: token,
      // onLoad: onIframeLoad,
      // devices,
      // userInfo,
    };

    const api = new JitsiMeetExternalAPI(domain, options);
    if (onAPILoad) onAPILoad(api);

    // api.addEventListener("videoConferenceJoined", () => {
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
      if (loaded) return;
      // @ts-ignore
      const getTokn = firebase.functions().httpsCallable("jitsi-getJitsiToken");
      const response = await getTokn({
        id: user.uid,
        name: profile?.partyName || "Participant",
        email: user.email,
        avatar: "https://primedre.space" + profile?.pictureUrl || "",
        tenant: JAAS_TENANT,
        apikey: JAAS_API_KEY,
        moderator: "true", // update with roles
        livestreaming: "true",
        recording: "true",
        transcription: "true",
      });
      setToken(response.data.token);
    })();
    // eslint-disable-next-line
  }, [firebase, user, profile, JAAS_API_KEY]);

  useEffect(() => {
    if (!token) return;
    if (loaded) return;
    setLoaded(true);
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
