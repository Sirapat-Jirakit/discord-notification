// pages/api/notifyDiscord.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // You can customize the content, including mentions.
  // For a user mention, use <@USER_ID>; for a role, use <@&ROLE_ID>.
  const discordMessage = {
    content: "<@YOUR_DISCORD_ID> A new user just signed in!",
  };

  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      throw new Error("Failed to send webhook");
    }

    return res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.error("Error sending Discord notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
