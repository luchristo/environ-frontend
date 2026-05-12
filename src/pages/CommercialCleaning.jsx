import BookingForm from "../components/BookingForm";

function CommercialCleaning() {
  return (
    <BookingForm
      service="Commercial Cleaning"
      options={[
        "Office Cleaning",
        "Shop Cleaning",
        "School Cleaning",
        "Communal Area Cleaning",
        "Contract Cleaning",
        "Emergency Cover",
      ]}
    />
  );
}

export default CommercialCleaning;