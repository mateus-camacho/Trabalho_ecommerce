import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { LoaderCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";

export interface DualRangeInputProps {
  min: number;
  max: number;
  loading: boolean;
  form: UseFormReturn<any>;
  name: string;
  label: string;
  customLabel: ReactNode;
}

export default function DualRangeInput({
  min,
  max,
  loading,
  form,
  name,
  label,
  customLabel,
}: DualRangeInputProps) {
  return (
    <FormItem className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-2 pb-8">
      <FormLabel className="text-base font-semibold text-gray-600">
        {label}
      </FormLabel>

      {loading ? (
        <div className="w-full h-14 flex items-center justify-center">
          <LoaderCircle size={32} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <FormField
          control={form.control}
          name={name}
          render={({ field }: any) => {
            return (
              <FormItem className="px-6 py-2">
                <FormControl>
                  <DualRangeSlider
                    min={min}
                    max={max}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    label={(value) => (
                      <span className="text-sm text-gray-600 flex items-center gap-1 whitespace-nowrap">
                        {customLabel}
                        {value}
                      </span>
                    )}
                    labelPosition="bottom"
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
      )}
    </FormItem>
  );
}
