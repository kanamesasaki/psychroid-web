import React, { useImperativeHandle, forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Process } from "../App";

interface ProcessCardProps {
    processData: Process;
    onChange: (data: Process) => void;
}

export type ProcessCardRef = {
    resetForm: () => void;
};

const ProcessCard = forwardRef<ProcessCardRef, ProcessCardProps>(
    ({ processData, onChange }, ref: React.ForwardedRef<ProcessCardRef>) => {
        const localProcessData: Process = processData;

        const resetForm = () => {
            localProcessData.processType = "Heating";
            localProcessData.inputType = "Power";
            localProcessData.value = 0.0;
        }

        useImperativeHandle(ref, () => ({
            resetForm,
        }));

        const handleProcessTypeChange = (value: string) => {
            let inputType: string = "";
            if (value === "Heating" || value === "Cooling") {
                inputType = "Power";
            } else if (value === "Humidify") {
                inputType = "ΔW Adiabatic";
            }

            localProcessData.processType = value;
            localProcessData.inputType = inputType;
            localProcessData.value = 0.0;

            onChange(localProcessData);
        };

        const handleInputTypeChange = (value: string) => {
            localProcessData.inputType = value;
            onChange(localProcessData);
        };

        const handleValueChange = (value: string) => {
            localProcessData.value = Number(value);
            onChange(localProcessData);
        };

        const renderInputs = () => {
            switch (localProcessData.processType) {
                case "Heating":
                    return (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {/* Top Row */}
                            <div>
                                <Label className="mb-1.5">Process Type</Label>
                                <Select value={localProcessData.processType} onValueChange={handleProcessTypeChange}>
                                    <SelectTrigger className="w-full py-1 h-9" aria-label="Process Type">
                                        <SelectValue placeholder="Select process type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Heating">Heating</SelectItem>
                                        <SelectItem value="Cooling">Cooling</SelectItem>
                                        <SelectItem value="Humidify">Humidify</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="mb-1.5">Input Type</Label>
                                <Select value={localProcessData.inputType} onValueChange={handleInputTypeChange}>
                                    <SelectTrigger className="w-full py-1 h-9" aria-label="Input Type">
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Power">Power</SelectItem>
                                        <SelectItem value="ΔT">ΔT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Bottom Row */}
                            <div>{/* Left bottom is blank */}</div>
                            <div>
                                <Label className="mb-1.5">
                                    {localProcessData.inputType === "Power" ? "Power [kW]" : "ΔT [°C]"}
                                </Label>
                                <Input
                                    type="number"
                                    value={localProcessData.value}
                                    onChange={(e) => handleValueChange(e.target.value)}
                                    placeholder={"0.0"}
                                />
                            </div>
                        </div>
                    );
                case "Cooling":
                    return (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {/* Top Row */}
                            <div>
                                <Label className="mb-1.5">Process Type</Label>
                                <Select value={localProcessData.processType} onValueChange={handleProcessTypeChange}>
                                    <SelectTrigger className="w-full" aria-label="Process Type">
                                        <SelectValue placeholder="Select process type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Heating">Heating</SelectItem>
                                        <SelectItem value="Cooling">Cooling</SelectItem>
                                        <SelectItem value="Humidify">Humidify</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="mb-1.5">Input Type</Label>
                                <Select value={localProcessData.inputType} onValueChange={handleInputTypeChange}>
                                    <SelectTrigger className="w-full" aria-label="Input Type">
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Power">Power</SelectItem>
                                        <SelectItem value="ΔT">ΔT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Bottom Row */}
                            <div>{/* Left bottom is blank */}</div>
                            <div>
                                <Label className="mb-1.5">
                                    {localProcessData.inputType === "Power" ? "Power [kW]" : "ΔT [°C]"}
                                </Label>
                                <Input
                                    type="number"
                                    value={localProcessData.value}
                                    onChange={(e) => handleValueChange(e.target.value)}
                                    placeholder={"0.0"}
                                />
                            </div>
                        </div>
                    );
                case "Humidify":
                    return (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {/* Top Row */}
                            <div>
                                <Label className="mb-1.5">Process Type</Label>
                                <Select value={localProcessData.processType} onValueChange={handleProcessTypeChange}>
                                    <SelectTrigger className="w-full" aria-label="Process Type">
                                        <SelectValue placeholder="Select process type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Heating">Heating</SelectItem>
                                        <SelectItem value="Cooling">Cooling</SelectItem>
                                        <SelectItem value="Humidify">Humidify</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="mb-1.5">Input Type</Label>
                                <Select value={localProcessData.inputType} onValueChange={handleInputTypeChange}>
                                    <SelectTrigger className="w-full" aria-label="Input Type">
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ΔW Adiabatic">ΔW Adiabatic</SelectItem>
                                        <SelectItem value="ΔW Isothermal">ΔW Isothermal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Bottom Row */}
                            <div>{/* Left bottom is blank */}</div>
                            <div>
                                <Label className="mb-1.5">
                                    {localProcessData.inputType === "ΔW Adiabatic" ? "ΔW Adiabatic [kg/s]" : "ΔW Isotherm [kg/s]"}
                                </Label>
                                <Input
                                    type="number"
                                    value={localProcessData.value}
                                    onChange={(e) => handleValueChange(e.target.value)}
                                    placeholder={"0.0"}
                                />
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        };

        return (
            <Card className="w-full">
                <CardHeader className="pb-0 pt-0 -mb-4 -mt-2">
                    <CardTitle className="text-lg">
                        Process Settings: {localProcessData.id} &#8211; {localProcessData.id + 1}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-0 pt-0 -mb-2">
                    <div className="flex flex-col gap-4">
                        {renderInputs()}
                        {/* <Button type="button" onClick={() => console.log("Process Applied")}>
                        Apply Process
                    </Button> */}
                    </div>
                </CardContent>
            </Card>
        );
    }
);

export default ProcessCard;