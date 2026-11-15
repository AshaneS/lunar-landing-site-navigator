import { Button } from "./ui/button";

export default function PanelSectionTwo() {
  return (
    <div className=" flex gap-2 items-center">
      <div>Window</div>
      <div className="flex items-center gap-1">
        <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">
          29.5D
        </Button>
        <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">
          90D
        </Button>
        <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">
          180D
        </Button>
        <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">
          354D
        </Button>
      </div>
    </div>
  );
}
