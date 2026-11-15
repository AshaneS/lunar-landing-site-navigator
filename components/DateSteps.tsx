import { Button } from "./ui/button";

export default function DateSteps() {
  return (
    <div className="flex items-center justify-center gap-1">
     <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">-1D</Button>
     <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">-6h</Button>
     <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">+6h</Button>
     <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">+1D</Button>
     <Button size={`sm`} variant={"default"} className="h-7 rounded-[5px]">Now</Button>
    </div>
  )
}