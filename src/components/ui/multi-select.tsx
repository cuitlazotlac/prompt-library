import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: string[];
  label?: string;
  allOptionLabel?: string;
  className?: string;
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ value, onValueChange, options, label, allOptionLabel = "All", className }, ref) => {
    const triggerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (triggerRef.current) {
        const width = triggerRef.current.offsetWidth;
        triggerRef.current.style.setProperty('--trigger-width', `${width}px`);
      }
    }, []);

    const getDisplayValue = () => {
      if (value.length === 0 || value.length === options.length || (value.length === 1 && value[0] === allOptionLabel)) {
        return allOptionLabel;
      }
      return `${value.length} selected`;
    };

    const handleSelectionChange = (optionValue: string, checked: boolean) => {
      let newValue: string[];
      
      if (optionValue === allOptionLabel) {
        newValue = checked ? options : [];
      } else if (checked) {
        newValue = [...value, optionValue];
        // If all individual options are selected, include the "All" option
        if (newValue.length === options.length - 1) {
          newValue = options;
        }
      } else {
        newValue = value.filter(v => v !== optionValue);
        // Remove "All" option if it exists when deselecting any option
        newValue = newValue.filter(v => v !== allOptionLabel);
      }

      onValueChange(newValue);
    };

    return (
      <div ref={triggerRef} className={cn("relative w-full", className)}>
        {label && (
          <label className="block mb-2 text-sm font-medium">{label}</label>
        )}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className="flex justify-between items-center px-3 py-2 w-full h-10 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {getDisplayValue()}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={4}
              className="z-50 w-[var(--trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
              style={{ width: 'var(--trigger-width)' }}
            >
              <div className="max-h-[300px] overflow-y-auto">
                {[allOptionLabel, ...options].map((option) => (
                  <div
                    key={option}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    onClick={() => handleSelectionChange(option, !value.includes(option))}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {value.includes(option) && <Check className="w-4 h-4" />}
                    </span>
                    {option}
                  </div>
                ))}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect }; 