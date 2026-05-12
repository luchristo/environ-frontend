import BookingForm from "../components/BookingForm";

function JetWash() {
  return (
    <BookingForm
      service="High Pressure Jet Wash"
      options={[
        "Driveway",
        "Patio",
        "Decking",
        "Garden Path",
        "Exterior Walls",
        "Bin Area",
      ]}
    />
  );
}

export default JetWash;