import BookingForm from "../components/BookingForm";

function CarpetCleaning() {
  return (
    <BookingForm
      service="Carpet Cleaning"
      options={[
        "Bedroom Carpet",
        "Living Room Carpet",
        "Hallway Carpet",
        "Staircase",
        "Small Rug",
        "Medium Rug",
        "Large Rug",
        "Mattress Cleaning",
      ]}
    />
  );
}

export default CarpetCleaning;