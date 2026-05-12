import BookingForm from "../components/BookingForm";

function EndOfTenancyCleaning() {
  return (
    <BookingForm
      service="End of Tenancy Cleaning"
      options={[
        "Studio Flat",
        "1 Bedroom Property",
        "2 Bedroom Property",
        "3+ Bedroom Property",
        "Carpet Add-on",
        "Oven Add-on",
      ]}
    />
  );
}

export default EndOfTenancyCleaning;