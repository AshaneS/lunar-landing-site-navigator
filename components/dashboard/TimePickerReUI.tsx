"use client";

import { useId, useState } from "react";
import { TimePicker } from "@/components/reui/time-picker";

import { Field, FieldGroup } from "@/components/ui/field";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function TimePickerReUI() {
  const id = useId();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [invalid, setInvalid] = useState(false);

  // Read current time from URL (default 00:00)

  // This fires ONLY when they click OK
  const handleTimeChange = (newTime: string) => {
    console.log("✅ TimePicker fired! Raw value:", newTime);
    if (!newTime) return;

    const params = new URLSearchParams(searchParams.toString());

    // Push the clean time to the URL
    params.set("time", newTime);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    /* `noValidate`: the Field draws the error, not the browser bubble. */
    <form
      noValidate
      className="w-40"
      onSubmit={(event) => {
        event.preventDefault();
        /* The picker submits `HH:mm` under its `name`, or "" while empty. */
        const time = String(
          new FormData(event.currentTarget).get("deliveryTime") ?? "",
        );
        setInvalid(!time);
      }}
      onReset={() => {
        /* The picker returns to its default (empty) on the same reset. */
        setInvalid(false);
      }}
    >
      <FieldGroup>
        <Field data-invalid={invalid || undefined}>
          {/* <FieldLabel id={`${id}-label`} htmlFor={id}>
            Delivery time
          </FieldLabel> */}
          <TimePicker
            id={id}
            name="deliveryTime"
            required
            requireConfirm
            /* Sets aria-invalid on the trigger; the Field colors the label. */
            invalid={invalid}
            minuteStep={30}
            min="00:00"
            max="23:00"
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-hint`}
            // onValueChange={(next) => {
            //   /* A pick clears the error; emptying the field waits for Submit. */
            //   if (next) setInvalid(false);
            onValueChange={handleTimeChange}
            // }}
          />
          {/* One id for both, so aria-describedby follows whichever is shown. */}
          {/* {invalid ? (
            <FieldError id={`${id}-hint`}>
              Choose a delivery time to continue.
            </FieldError>
          ) : (
            <FieldDescription id={`${id}-hint`}>
              30-minute slots between 08:00 and 20:00.
            </FieldDescription>
          )} */}
        </Field>
        {/* <div className="flex items-center gap-2">
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="outline">
            Reset
          </Button>
          <p
            role="status"
            className="text-muted-foreground ms-auto min-w-0 truncate text-sm"
          >
            {booked && `Delivery booked for ${booked}`}
          </p>
        </div> */}
      </FieldGroup>
    </form>
  );
}
