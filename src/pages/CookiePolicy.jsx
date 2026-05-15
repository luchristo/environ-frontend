function CookiePolicy() {
  return (
    <div style={container}>
      <h1>Cookie Policy</h1>

      <p>
        Environ Facilities may use cookies to improve website performance and
        user experience.
      </p>

      <h2>What Are Cookies?</h2>

      <p>
        Cookies are small text files stored on your device when visiting a
        website.
      </p>

      <h2>How We Use Cookies</h2>

      <p>
        We use cookies for analytics, website functionality and improving our
        services.
      </p>

      <h2>Managing Cookies</h2>

      <p>
        You can disable cookies through your browser settings at any time.
      </p>
    </div>
  );
}

const container = {
  maxWidth: "900px",
  margin: "40px auto",
  padding: "30px",
  backgroundColor: "white",
  borderRadius: "20px",
  fontFamily: "Arial",
  lineHeight: "1.7",
};

export default CookiePolicy;