// pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  const handleForwardEmail = async () => {
    try {
      const res = await fetch("/api/forwardEmail",
		{ method: "POST",
		credentials: "include", 
	});
      const data = await res.json();
      console.log("Forward email response:", data);
    } catch (error) {
      console.error("Error forwarding email:", error);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  if (!session) {
    return (
      <div>
        <h1>Welcome!</h1>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Signed in as {session.user.email}</h1>
      <button onClick={() => signOut()}>Sign out</button>
      <br />
      <br />
      <button onClick={handleForwardEmail}>
        Check and Forward New Email to Discord
      </button>
    </div>
  );
}
