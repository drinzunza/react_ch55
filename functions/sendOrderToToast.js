const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
//const axios = require("axios");

// Ensure Firebase Admin is initialized (will be done in index.js)
// This function assumes admin.initializeApp() has already been called

exports.sendOrderToToast = onCall(async (request) => {
    const { data, auth } = request;
    const { items, timestamp } = data;

    // Check if user is authenticated
    if (!auth) {
        throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    // Get userId from authenticated context (not from client data)
    const userId = auth.uid;

    if (!Array.isArray(items)) {
        throw new HttpsError("invalid-argument", "Invalid input: items must be an array");
    }

    const orderData = {
        userId,
        items,
        timestamp,
        status: "pending"
    };

    // Save to Realtime Database
    const orderRef = await admin.database().ref('orders/delivery').push(orderData);

    // Call Toast API
    try {
        //     await axios.post("https://api.toast.com/orders", {
        //       externalOrderId: orderRef.id,
        //       items,
        //       userId
        //     });

        //     await orderRef.update({ status: "sent_to_toast" });
        return { success: true, orderId: orderRef.id };
    } catch (error) {
        await orderRef.update({ status: "toast_error", error: error.message });
        throw new HttpsError("internal", "Toast API failed");
    }
}); 