const functions = require("firebase-functions");
const JAAS_CONFIG = functions.config().jaas;

var jsonwebtoken = require("jsonwebtoken");

const generate = (privateKey, { id, name, email, avatar, appId, kid }) => {
  const now = new Date();
  const jwt = jsonwebtoken.sign(
    {
      aud: "jitsi",
      context: {
        user: {
          id,
          name,
          avatar,
          email: email,
          moderator: "true",
        },
        features: {
          livestreaming: "true",
          recording: "true",
          transcription: "true",
          "outbound-call": "true",
        },
      },
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
  });
  return {
    token: token.toString(),
  };
});
