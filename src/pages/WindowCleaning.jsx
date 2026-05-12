import BookingForm from "../components/BookingForm";

function WindowCleaning() {
  return (
    <BookingForm
      service="Window Cleaning"
      options={[
        "External Windows",
        "Internal Windows",
        "Ground Floor",
        "1st Floor",
        "2nd Floor",
        "Commercial Windows",
      ]}
    />
  );
}

export default WindowCleaning;