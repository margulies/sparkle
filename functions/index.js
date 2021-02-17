const firebase = require("firebase");
const admin = require("firebase-admin");
const { passwordsMatch } = require("./auth");

require("firebase/firestore");
const functions = require("firebase-functions");

const functionsConfig = functions.config();

console.log("functions.config()", JSON.stringify(functionsConfig, null, 2));

if (!functionsConfig) throw new Error("failed: functionsConfig missing");
if (!functionsConfig.project)
  throw new Error("failed: functionsConfig.project missing");
if (!functionsConfig.project.id)
  throw new Error("failed: functionsConfig.project.id missing");

const firebaseConfig = {
  projectId: functionsConfig.project.id,
};
firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  ...firebaseConfig,
  credential: admin.credential.cert({
    ...functionsConfig.service_account,
    private_key: functionsConfig.service_account.private_key.replace(
      /\\n/g,
      "\n"
    ),
  }),
});

const video = require("./video");
const payment = require("./payment");
const venue = require("./venue");
const stats = require("./stats");
const access = require("./access");
const jitsi = require("./jitsi");

exports.checkPassword = functions.https.onCall(async (data) => {
  await firebase
    .firestore()
    .doc(`venues/${data.venue}`)
    .get()
    .then((doc) => {
      if (
        doc &&
        doc.exists &&
        doc.data() &&
        doc.data().password &&
        passwordsMatch(data.password, doc.data().password)
      ) {
        return "OK";
      }
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Password incorrect"
      );
    });
});

exports.video = video;
exports.payment = payment;
exports.venue = venue;
exports.stats = stats;
exports.access = access;
exports.jitsi = jitsi;
