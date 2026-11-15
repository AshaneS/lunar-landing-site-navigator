import { Button } from "../ui/button";
import DatePicker from "./DatePicker";
import LandingSiteMenu from "./LandingSiteMenu";
import SiteCoordinates from "./SiteCoordinates";
import { TimePickerReUI } from "./TimePickerReUI";

export default function Panel() {
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <div className="flex items-center justify-between w-full gap-4">
          <LandingSiteMenu />
          <SiteCoordinates />
          <DatePicker />
          <TimePickerReUI />
        </div>
      </div>
      <div>
        <div className=" flex gap-2 items-center">
          <div>Lunar Day </div>
          <div className="flex items-center gap-1">
            <Button
              size={`sm`}
              variant={"default"}
              className="h-7 rounded-[5px]"
            >
              29.5D
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
