import BookingForm from "../components/BookingForm";

function GardenMaintenance() {
  return (
    <BookingForm
      service="Garden Maintenance"
      options={[
        "Lawn Mowing",
        "Hedge Trimming",
        "Weed Removal",
        "Garden Clearance",
        "Waste Removal",
        "Regular Maintenance",
      ]}
    />
  );
}

export default GardenMaintenance;