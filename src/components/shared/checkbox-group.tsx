import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Category } from "@/core/models/category";
import { LoaderCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

export interface CheckboxGroupProps {
  values: {
    value: any;
    label: string;
  }[];
  loading: boolean;
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

export default function CheckboxGroup({
  values,
  loading,
  form,
  name,
  label,
}: CheckboxGroupProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-2">
          <div>
            <FormLabel className="text-base font-semibold text-gray-600">
              {label}
            </FormLabel>
          </div>
          {loading ? (
            <div className="w-full h-14 flex items-center justify-center">
              <LoaderCircle size={32} className="text-blue-500 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[300px] w-full rounded-md">
              {values.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name={name}
                  render={({ field }: any) => {
                    return (
                      <FormItem
                        key={item.value}
                        className="flex flex-row items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            id={item.value}
                            checked={field.value?.includes(item.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.value])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: any) => value !== item.value
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel
                          className="text-sm font-normal cursor-pointer"
                          htmlFor={item.value}
                        >
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </ScrollArea>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
