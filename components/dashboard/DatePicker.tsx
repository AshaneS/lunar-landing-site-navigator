"use client";

import { format, parse } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DatePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const [date, setDate] = useState<Date>();

  //Read the date from the URL
  const dateParam = searchParams.get("date");

    // If no date in URL, default to today
  const defaultDate = format(new Date(), "yyyy-MMM-dd");

  //Parse it safely (so it doesn't shift by a day due to timezones)
  const date = dateParam
    ? parse(dateParam, "yyyy-MMM-dd", new Date())
    : parse(defaultDate, "yyyy-MMM-dd", new Date());

  // When the user selects a date, push it to the URL
  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) return;

    const params = new URLSearchParams(searchParams.toString());

    // Format as YYYY-MM-DD for NASA Horizons
    params.set("date", format(newDate, "yyyy-MMM-dd"));

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            data-empty={!date}
            className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
        }
      />

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date}
          captionLayout={"dropdown"}
        />
      </PopoverContent>
    </Popover>
  );
}
