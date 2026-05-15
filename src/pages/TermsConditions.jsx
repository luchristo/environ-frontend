function TermsConditions() {
  return (
    <div style={container}>
      <h1>Terms & Conditions</h1>

      <p>
        By using Environ Facilities services, you agree to the following terms.
      </p>

      <h2>Quotes</h2>

      <p>
        All quotes are estimates based on the information provided by the
        customer.
      </p>

      <h2>Payments</h2>

      <p>
        Payment is due upon completion of the agreed service unless otherwise
        stated.
      </p>

      <h2>Liability</h2>

      <p>
        Environ Facilities will not be responsible for pre-existing damage or
        issues not disclosed before work begins.
      </p>

      <h2>Cancellations</h2>

      <p>
        Customers should provide reasonable notice for cancellations or booking
        changes.
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

export default TermsConditions;