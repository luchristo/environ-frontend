import BookingForm from "../components/BookingForm";

function Operatives() {
  return (
    <BookingForm
      service="Professional Cleaning Operatives"
      options={[
        "Temporary Staff",
        "Event Cleaning Staff",
        "Office Cleaning Staff",
        "Emergency Cleaning Cover",
        "Regular Operatives",
        "Commercial Support",
      ]}
    />
  );
}

export default Operatives;