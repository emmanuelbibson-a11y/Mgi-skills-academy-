
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, course } = req.body || {};

    const courses = {
      "Multi TV / DStv Installation": 499,
      "CCTV Installation": 499,
      "Double LNB Installation": 399,
      "Bio-Digester Toilet Installation": 499,
      "All Courses": 1499
    };

    if (!name || !email || !phone || !courses[course]) {
      return res.status(400).json({ error: "Invalid enrollment details" });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      return res.status(500).json({ error: "Payment configuration missing" });
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          amount: courses[course] * 100,
          currency: "GHS",
          callback_url: `${process.env.SITE_URL}/payment-callback`,
          metadata: {
            student_name: name,
            student_phone: phone,
            course
          }
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
      return res.status(400).json({
        error: result.message || "Payment initialization failed"
      });
    }

    return res.status(200).json({
      authorization_url: result.data.authorization_url,
      reference: result.data.reference
    });

  } catch (error) {
    return res.status(500).json({
      error: "Unable to initialize payment"
    });
  }
}

