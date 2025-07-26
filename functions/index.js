/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.sendOrderToToast = functions.https.onCall(async (data, context) => {
  const { userId, items, timestamp } = data;

  if (!userId || !Array.isArray(items)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid input");
  }

  const orderData = {
    userId,
    items,
    timestamp,
    status: "pending"
  };

  // Save to Firestore
  const orderRef = await admin.firestore().collection("orders").add(orderData);

  // Call Toast API
  try {
    await axios.post("https://api.toast.com/orders", {
      externalOrderId: orderRef.id,
      items,
      userId
    });

    await orderRef.update({ status: "sent_to_toast" });
    return { success: true, orderId: orderRef.id };
  } catch (error) {
    await orderRef.update({ status: "toast_error", error: error.message });
    throw new functions.https.HttpsError("internal", "Toast API failed");
  }
});
