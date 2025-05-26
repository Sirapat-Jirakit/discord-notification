## Discord Notification System
This project is a Discord Notification System.\
It retrieves messages from a new email inbox and forwards them to Discord using a Discord webhook.\
Discord will automatically tag the relevant person or teams in the chat based on the content of the email.

## Library & Tools

- Next.js
- NextAuth
- Discord (Webhook)
- Google Cloud Platform (GCP)
- Gmail API

## System Requirements
To set up the system, you need to create a project on Google Cloud Platform and configure a Discord webhook.

### Google Cloud Platform
- Enable the Gmail API for your project.

- Create credentials using OAuth 2.0 Client ID:
	- Set the Application type to Web Application.
	- Set the Authorized redirect URIs to
	[http://localhost:3000/api/auth/callback/google](http://localhost:3000/api/auth/callback/google)
	- Copy Client ID and Client Secret to your environment file.

- Configure the OAuth consent screen:
	- Add test users emails to the test application.
	- Add the requried data access scopes.

	```bash
		https://www.googleapis.com/auth/gmail.readonly
		https://www.googleapis.com/auth/userinfo.email
		https://www.googleapis.com/auth/userinfo.profile
	```

### Discord
- Create a webhook in your desired Discord channel.
- Copy the webhook URL to your environment file.

### Environment variables

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- DISCORD_WEBHOOK_URL
- AUTH_SECRET

## How to run local

```bash
npm install
```

```bash
npx auth secret
```

```bash
npm run start
```

Web server will live on

```bash
http://localhost:3000/
```

url : [http://localhost:3000/](http://localhost:3000/)