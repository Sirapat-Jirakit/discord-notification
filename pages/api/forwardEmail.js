// pages/api/forwardEmail.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the user session to obtain the Google access token
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Request the list of messages from the user's Gmail inbox.
    // Here we simply request one message. In a real app you might want to query by "UNREAD" label.
	console.log(`Bearer Token :${session.accessToken}`);
	
    const gmailResponse = await fetch(
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread+label:INBOX&maxResults=1",
  {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  }
);
    const gmailData = await gmailResponse.json();
	console.log("Gmail API response:", gmailData);

    // Ensure that there is at least one email to process.
    if (
      gmailData.resultSizeEstimate &&
      gmailData.messages &&
      gmailData.messages.length > 0
    ) {
      const messageId = gmailData.messages[0].id;

      // Retrieve the full details of the message.
      const messageResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const messageDetails = await messageResponse.json();

      // Extract desired header info (e.g., Subject and From)
      let subject = "No Subject";
      let from = "Unknown Sender";
      if (messageDetails.payload?.headers) {
        messageDetails.payload.headers.forEach((header) => {
          if (header.name === "Subject") {
            subject = header.value;
          }
          if (header.name === "From") {
            from = header.value;
          }
        });
      }

      // Prepare a Discord webhook message with a mention.
      // For a user mention use the format <@USER_ID>; for a role mention, use <@&ROLE_ID>
      const discordMessage = {
        content: `<@250957262359625729> New email received from ${from}!\nSubject: ${subject}`,
      };

      // Send the message to Discord using the configured webhook.
      const webhookResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordMessage),
      });

      if (!webhookResponse.ok) {
        throw new Error("Failed to send notification to Discord.");
      }

      return res.status(200).json({
        message: "Email forwarded to Discord",
        email: { from, subject },
      });
    }

    return res.status(200).json({ message: "No new emails found" });
  } catch (error) {
    console.error("Error forwarding email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
