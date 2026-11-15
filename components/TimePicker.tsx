"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TimePicker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  //Read the time from the URL (defaults to 00:00)
  const time = searchParams.get("time") ?? "00:00";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Slice the first 5 characters to get strictly "HH:MM"
    const cleanTime = e.target.value.slice(0, 5);
    const params = new URLSearchParams(searchParams.toString());
    params.set("time", cleanTime);
    // router.replace prevents the page from jumping to top
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex max-w-100px">
      <Input
        type="time"
        id="time-picker"
        step="1"
        value={time}
        defaultValue="08:30:00"
        onChange={handleChange}
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
}
