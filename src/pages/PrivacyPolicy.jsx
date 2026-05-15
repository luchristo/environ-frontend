function PrivacyPolicy() {
  return (
    <div style={container}>
      <h1>Privacy Policy</h1>

      <p>
        Environ Facilities respects your privacy and is committed to protecting
        your personal information.
      </p>

      <h2>Information We Collect</h2>

      <p>
        We may collect your name, email address, phone number, property address
        and any information submitted through our website forms.
      </p>

      <h2>How We Use Your Information</h2>

      <p>
        Your information is used to respond to enquiries, provide quotes,
        arrange services and improve customer support.
      </p>

      <h2>Data Protection</h2>

      <p>
        We do not sell or share your personal data with third parties unless
        required by law.
      </p>

      <h2>Contact</h2>

      <p>
        Email: environfacilities@gmail.com
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

export default PrivacyPolicy;