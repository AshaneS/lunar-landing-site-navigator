import DatePicker from "./dashboard/DatePicker";
import DateSteps from "./DateSteps";
import SiteCoordinates from "./dashboard/SiteCoordinates";
import TimePicker from "./TimePicker";
import LandingSiteMenu from "./dashboard/LandingSiteMenu";

export default function PanelSectionOne() {
  return (
    <div className="flex items-center justify-between w-full gap-4">
      <LandingSiteMenu />
      <SiteCoordinates />
      <DatePicker />
      <TimePicker />
      <DateSteps />
    </div>
  );
}
