'use client';

import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import Button from "./Button";
import { clsx } from "clsx";
import { useState } from "react";

interface SelectProps {
    options: any[];
    defaultValue: any;
    onSelect: (value: any) => void;
};

const Select: React.FC<SelectProps> = ({ options, defaultValue, onSelect }) => {
    return (
        <SelectPrimitive.Root defaultValue={defaultValue} onValueChange={(value: any) => onSelect(value)}>
            <SelectPrimitive.Trigger asChild aria-label="Months">
                <Button>
                <SelectPrimitive.Value />
                <SelectPrimitive.Icon className="ml-2">
                    <ChevronDownIcon />
                </SelectPrimitive.Icon>
                </Button>
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Content>
                <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700">
                <ChevronUpIcon />
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className="bg-white p-2 rounded-lg shadow-lg">
                <SelectPrimitive.Group>
                    {options.map(
                    (f, i) => (
                        <SelectPrimitive.Item
                        key={`${f}-${i}`}
                        value={f}
                        onChange={() => onSelect(f)}
                        className={clsx(
                            "relative flex items-center px-10 py-5 rounded-md text-sm text-gray-700 font-medium focus:bg-gray-100",
                            "radix-disabled:opacity-50",
                            "focus:outline-none select-none"
                        )}
                        >
                        <SelectPrimitive.ItemText>{f}</SelectPrimitive.ItemText>
                        <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon />
                        </SelectPrimitive.ItemIndicator>
                        </SelectPrimitive.Item>
                    )
                    )}
                </SelectPrimitive.Group>
                </SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700">
                <ChevronDownIcon />
                </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
        </SelectPrimitive.Root>
    );
}

export default Select;