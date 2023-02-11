import axios from "axios";

export const createInvoice = async (user) => {
  try {
    const header = {
      "Content-Type": "application/json",
      "X-Api-Key": user.in_key,
    };

    const body = {
      memo: "tip",
      out: false,
      amount: 1,
    };

    const response = await axios.post(
      `https://${process.env.LNBITS_URL}/api/v1/payments`,
      body,
      { headers: header }
    );

    return response.data.payment_request;
  } catch (error) {
    console.error("An error occurred in createInvoice:", error);
    throw error;
  }
};

export const payInvoice = async (invoice, session) => {
  try {
    const header = {
      "Content-Type": "application/json",
      "X-Api-Key": session.user.admin_key,
    };

    const body = {
      out: true,
      bolt11: invoice,
    };

    const response = await axios.post(
      `${process.env.LNBITS_URL}/api/v1/payments`,
      body,
      { headers: header }
    );

    return response.data;
  } catch (error) {
    console.error("An error occurred in payInvoice:", error);
    throw error;
  }
};

export const tipAction = async (username, session) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/users/${username}`
    );

    const user = response.data[0];

    if (user) {
      const invoice = await createInvoice(user);

      if (invoice) {
        const tip = await payInvoice(invoice, session);

        console.log("tip", tip);

        if (tip) {
          return true;
        }
      }
    }
  } catch (error) {
    console.error("An error occurred in tipAction:", error);
    throw error;
  }
};
