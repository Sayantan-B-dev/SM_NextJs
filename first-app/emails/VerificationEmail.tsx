// Import required React Email components
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Font,
  Preview
} from "@react-email/components";

// Define prop types for better TypeScript safety
interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>

        {/* Register custom font */}
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      {/* Email preview text shown in inbox snippet */}
      <Preview>Your verification code is {otp}</Preview>

      <Body
        style={{
          backgroundColor: "#f4f4f4",
          fontFamily: "Roboto, Verdana, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* Main heading */}
          <Heading
            style={{
              textAlign: "center",
              color: "#111827",
              fontSize: "24px",
            }}
          >
            Verify Your Email
          </Heading>

          {/* Greeting section */}
          <Text
            style={{
              fontSize: "16px",
              color: "#374151",
              lineHeight: "24px",
            }}
          >
            Hello <strong>{username}</strong>,
          </Text>

          <Text
            style={{
              fontSize: "16px",
              color: "#374151",
              lineHeight: "24px",
            }}
          >
            Thank you for signing up. Use the verification code below to
            complete your registration.
          </Text>

          {/* OTP section */}
          <Section
            style={{
              textAlign: "center",
              margin: "30px 0",
            }}
          >
            <Text
              style={{
                display: "inline-block",
                backgroundColor: "#111827",
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "bold",
                letterSpacing: "6px",
                padding: "15px 25px",
                borderRadius: "6px",
              }}
            >
              {otp}
            </Text>
          </Section>

          {/* Expiry note */}
          <Text
            style={{
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "22px",
            }}
          >
            This code will expire in 10 minutes. Please do not share it with
            anyone.
          </Text>

          {/* Footer */}
          <Text
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            If you didn’t request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}