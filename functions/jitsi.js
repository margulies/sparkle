const functions = require("firebase-functions");
const JAAS_CONFIG = functions.config().jaas;

var jsonwebtoken = require("jsonwebtoken");

const generate = (
  privateKey,
  {
    id,
    name,
    email,
    avatar,
    appId,
    kid,
    moderator,
    livestreaming,
    recording,
    transcription,
  }
) => {
  const now = new Date();
  const jwt = jsonwebtoken.sign(
    {
      aud: "jitsi",
      context: {
        user: {
          id,
          name,
          avatar: avatar,
          email: email,
          moderator: moderator,
        },
        features: {
          livestreaming: livestreaming,
          recording: recording,
          transcription: transcription,
          "outbound-call": "true",
        },
      },
      moderator: moderator,
      iss: "chat",
      room: "*",
      sub: appId,
      exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
      nbf: Math.round(new Date().getTime() / 1000) - 10,
    },
    privateKey,
    { algorithm: "RS256", header: { kid } }
  );
  return jwt;
};

exports.getJitsiToken = functions.https.onCall((data) => {
  const token = generate(JAAS_CONFIG.private_key.replace(/\\n/g, "\n"), {
    id: data.id,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    appId: data.tenant,
    kid: data.apikey,
    moderator: data.moderator,
    livestreaming: data.livestreaming,
    recording: data.recording,
    transcription: data.transcription,
  });
  return {
    token: token.toString(),
  };
});
