import BookingForm from "../components/BookingForm";

function BuildingManagement() {
  return (
    <BookingForm
      service="Building Management Support"
      options={[
        "Communal Cleaning",
        "Bin Store Management",
        "Caretaker Support",
        "Inspection Support",
        "Estate Support",
        "Regular Site Visits",
      ]}
    />
  );
}

export default BuildingManagement;