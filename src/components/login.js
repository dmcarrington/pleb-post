import { signIn } from "next-auth/react";
import styles from "./login.module.css";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useRouter } from "next/router";
import { LightningAuthWithExplainer, SlashtagsAuth } from "./lightning-auth";
import LoginButton from "./login-button";

export default function Login({
  providers,
  callbackUrl,
  error,
  text,
  Header,
  Footer,
}) {
  const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    CredentialsSignin: "Auth failed",
    default: "Unable to sign in.",
  };

  const [errorMessage, setErrorMessage] = useState(
    error && (errors[error] ?? errors.default)
  );
  const router = useRouter();

  if (router.query.type === "lightning") {
    return <LightningAuthWithExplainer callbackUrl={callbackUrl} text={text} />;
  }

  if (router.query.type === "slashtags") {
    return <SlashtagsAuth callbackUrl={callbackUrl} text={text} />;
  }

  return (
    <div className={styles.login}>
      {Header && <Header />}
      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => setErrorMessage(undefined)}
          dismissible
        >
          {errorMessage}
        </Alert>
      )}
      {providers &&
        Object.values(providers).map((provider) => {
          switch (provider.name) {
            case "Lightning":
            case "Slashtags":
              return (
                <LoginButton
                  className={`mt-2 ${styles.providerButton}`}
                  key={provider.name}
                  type={provider.name.toLowerCase()}
                  onClick={() =>
                    router.push({
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        type: provider.name.toLowerCase(),
                      },
                    })
                  }
                  text={`${text || "Login"} with`}
                />
              );
            default:
              return (
                <LoginButton
                  className={`mt-2 ${styles.providerButton}`}
                  key={provider.name}
                  type={provider.name.toLowerCase()}
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  text={`${text || "Login"} with`}
                />
              );
          }
        })}
      {Footer && <Footer />}
    </div>
  );
}