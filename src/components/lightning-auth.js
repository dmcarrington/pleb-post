import { gql, useMutation, useQuery } from "@apollo/client";
import { signIn } from "next-auth/client";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import AccordianItem from "./accordian-item";
import Qr, { QrSkeleton } from "./qr";
import styles from "./lightning-auth.module.css";
import BackIcon from "../svgs/arrow-left-line.svg";
import { useRouter } from "next/router";

function QrAuth({ k1, encodedUrl, slashtagUrl, callbackUrl }) {
  const query = gql`
  {
    lnAuth(k1: "${k1}") {
      pubkey
      k1
    }
  }`;
  const { data } = useQuery(query, { pollInterval: 1000 });

  if (data && data.lnAuth.pubkey) {
    signIn(encodedUrl ? "lightning" : "slashtags", {
      ...data.lnAuth,
      callbackUrl,
    });
  }

  // output pubkey and k1
  return (
    <Qr
      value={encodedUrl || slashtagUrl}
      asIs={!!slashtagUrl}
      status="waiting for you"
    />
  );
}

function LightningExplainer({ text, children }) {
  const router = useRouter();
  return (
    <Container sm>
      <div className={styles.login}>
        <div
          className="w-100 mb-3 text-muted pointer"
          onClick={() => router.back()}
        >
          <BackIcon />
        </div>
        <h3 className="w-100 pb-2">{text || "Login"} with Lightning</h3>
        <div className="font-weight-bold text-muted pb-4">
          This is the most private way to use Stacker News. Just open your
          Lightning wallet and scan the QR code.
        </div>
        <Row className="w-100 text-muted">
          <Col className="pl-0 mb-4" md>
            <AccordianItem
              header={`Which wallets can I use to ${(
                text || "Login"
              ).toLowerCase()}?`}
              body={
                <>
                  <Row className="mb-3 no-gutters">
                    You can use any wallet that supports lnurl-auth. These are
                    some wallets you can use:
                  </Row>
                  <Row>
                    <Col xs>
                      <ul className="mb-0">
                        <li>Alby</li>
                        <li>Balance of Satoshis</li>
                        <li>Blixt</li>
                        <li>Breez</li>
                        <li>Blue Wallet</li>
                        <li>Coinos</li>
                        <li>LNBits</li>
                        <li>LNtxtbot</li>
                      </ul>
                    </Col>
                    <Col xs>
                      <ul>
                        <li>Phoenix</li>
                        <li>Simple Bitcoin Wallet</li>
                        <li>Sparrow Wallet</li>
                        <li>ThunderHub</li>
                        <li>Zap Desktop</li>
                        <li>Zeus</li>
                      </ul>
                    </Col>
                  </Row>
                </>
              }
            />
          </Col>
          <Col md className="mx-auto" style={{ maxWidth: "300px" }}>
            {children}
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export function LightningAuthWithExplainer({ text, callbackUrl }) {
  return (
    <LightningExplainer text={text}>
      <LightningAuth callbackUrl={callbackUrl} />
    </LightningExplainer>
  );
}

export function LightningAuth({ callbackUrl }) {
  // query for challenge
  const [createAuth, { data, error }] = useMutation(gql`
    mutation createAuth {
      createAuth {
        k1
        encodedUrl
      }
    }
  `);

  useEffect(() => {
    createAuth();
  }, []);

  if (error) return <div>error</div>;

  return data ? (
    <QrAuth {...data.createAuth} callbackUrl={callbackUrl} />
  ) : (
    <QrSkeleton status="generating" />
  );
}

export function SlashtagsAuth({ callbackUrl }) {
  // query for challenge
  const [createAuth, { data, error }] = useMutation(gql`
    mutation createAuth {
      createAuth {
        k1
        slashtagUrl
      }
    }
  `);

  useEffect(() => {
    createAuth();
  }, []);

  if (error) return <div>error</div>;

  return data ? (
    <QrAuth {...data.createAuth} callbackUrl={callbackUrl} />
  ) : (
    <QrSkeleton status="generating" />
  );
}
