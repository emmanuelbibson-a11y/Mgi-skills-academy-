
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      return res.status(500).json({
        error: "Payment configuration missing"
      });
    }

    const { reference } = req.body || {};

    if (!reference) {
      return res.status(400).json({
        error: "Payment reference is required"
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
      return res.status(400).json({
        error: "Unable to verify payment"
      });
    }

    const payment = result.data;

    if (payment.status !== "success") {
      return res.status(402).json({
        error: "Payment not successful"
      });
    }

    if (payment.currency !== "GHS") {
      return res.status(400).json({
        error: "Invalid payment currency"
      });
    }

    const courses = {
      "Multi TV / DStv Installation": 499,
      "CCTV Installation": 499,
      "Double LNB Installation": 399,
      "Bio-Digester Toilet Installation": 499,
      "All Courses": 1499
    };

    const metadata = payment.metadata || {};
    const course = metadata.course;
    const expectedAmount = courses[course];

    if (!expectedAmount || payment.amount !== expectedAmount * 100) {
      return res.status(400).json({
        error: "Payment amount or course mismatch"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      student: {
        name: metadata.student_name,
        phone: metadata.student_phone,
        email: payment.customer.email
      },
      course: course,
      reference: payment.reference,
      amount: expectedAmount,
      currency: "GHS"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Payment verification failed"
    });
  }
}
