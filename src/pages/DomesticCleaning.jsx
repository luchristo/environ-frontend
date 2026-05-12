import BookingForm from "../components/BookingForm";

function DomesticCleaning() {
  return (
    <BookingForm
      service="Domestic Cleaning"
      options={[
        "One-off Cleaning",
        "Regular Weekly Cleaning",
        "Deep Cleaning",
        "Kitchen Cleaning",
        "Bathroom Cleaning",
        "After Builders Cleaning",
      ]}
    />
  );
}

export default DomesticCleaning;