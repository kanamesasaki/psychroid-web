import React, { useImperativeHandle, forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Process } from "../App";

interface ProcessCardProps {
    isSI: boolean;
    processData: Process;
    onChange: (data: Process) => void;
}

export type ProcessCardRef = {
    resetForm: () => void;
};

const ProcessCard = forwardRef<ProcessCardRef, ProcessCardProps>(
    ({ isSI, processData, onChange }, ref: React.ForwardedRef<ProcessCardRef>) => {
        const localProcessData: Process = processData;

        const resetForm = () => {
            localProcessData.processType = "Heating";
            localProcessData.inputType = "Power";
            localProcessData.value = 0.0;
        }

        useImperativeHandle(ref, () => ({
            resetForm,
        }));

        // process member variables
        // id: number;
        // processType: string;  
        // inputType: string;
        // value: number;
        // mixDryBulb: number;
        // mixFlowRateType: string;
        // mixFlowRateValue: number;
        // mixHumidityType: string;
        // mixHumidityValue: number;

        const handleProcessTypeChange = (value: string) => {
            if (value === "Heating" || value === "Cooling") {
                localProcessData.processType = value;
                localProcessData.inputType = "Power";
                localProcessData.value = 0.0;
            } else if (value === "Humidify") {
                localProcessData.processType = value;
                localProcessData.inputType = "ΔW Adiabatic";
                localProcessData.value = 0.0;
            } else if (value === "Mixing") {
                localProcessData.processType = value;
                localProcessData.mixDryBulb = 20.0;
                localProcessData.mixFlowRateType = "volumetric_flow_rate";
                localProcessData.mixFlowRateValue = 0.0;
                localProcessData.mixHumidityType = "relative_humidity";
                localProcessData.mixHumidityValue = 50.0;
            }
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

        const handleMixDryBulbChange = (value: string) => {
            localProcessData.mixDryBulb = Number(value);
            onChange(localProcessData);
        };

        const handleMixFlowRateTypeChange = (value: string) => {
            localProcessData.mixFlowRateType = value;
            onChange(localProcessData);
        };

        const handleMixFlowRateValueChange = (value: string) => {
            localProcessData.mixFlowRateValue = Number(value);
            onChange(localProcessData);
        };

        const handleMixHumidityTypeChange = (value: string) => {
            localProcessData.mixHumidityType = value;
            onChange(localProcessData);
        };

        const handleMixHumidityValueChange = (value: string) => {
            localProcessData.mixHumidityValue = Number(value);
            onChange(localProcessData);
        };

        // Unit system dependent labels
        const humidityRatioUnit = isSI ? "kg/kg" : "lb/lb";
        // const pressureUnit = isSI ? "Pa" : "Psi";
        const temperatureUnit = isSI ? "°C" : "°F";
        const enthalpyUnit = isSI ? "kJ/kg" : "Btu/lb";
        const volumetricFlowRateUnit = isSI ? "m³/h" : "ft³/min";
        const massFlowRateUnit = isSI ? "kg/s" : "lb/h";
        const powerUnit = isSI ? "kW" : "Btu/h";

        const getRangeForInputType = (inputType: string) => {
            switch (inputType) {
                case "humidity_ratio":
                    return { min: 0.0, max: undefined };
                case "relative_humidity":
                    return { min: 0.0, max: 100.0 };
                case "t_wet_bulb":
                    return { min: isSI ? -100.0 : -148.0, max: isSI ? 200.0 : 392.0 };
                case "t_dew_point":
                    return { min: isSI ? -100.0 : -148.0, max: isSI ? 200.0 : 392.0 };
                case "specific_enthalpy":
                    return { min: 0.0, max: isSI ? 500.0 : 215.0 };
                default:
                    return { min: 0.0, max: 1.0 };
            }
        };

        const { min, max } = getRangeForInputType(localProcessData.mixHumidityType);

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
                                        <SelectItem value="Mixing">Mixing</SelectItem>
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
                                    {localProcessData.inputType === "Power" ?
                                        `Power [${powerUnit}]` :
                                        `ΔT [${temperatureUnit}]`
                                    }
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
                                        <SelectItem value="Mixing">Mixing</SelectItem>
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
                                    {localProcessData.inputType === "Power" ?
                                        `Power [${powerUnit}]` :
                                        `ΔT [${temperatureUnit}]`
                                    }
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
                                        <SelectItem value="Mixing">Mixing</SelectItem>
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
                                    {localProcessData.inputType === "ΔW Adiabatic" ?
                                        `ΔW Adiabatic [${massFlowRateUnit}]` :
                                        `ΔW Isotherm [${massFlowRateUnit}]`
                                    }
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
                case "Mixing":
                    return (
                        <div className="grid grid-cols-2 gap-4">
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
                                        <SelectItem value="Mixing">Mixing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="mb-1.5">Dry-bulb Temperature [{temperatureUnit}]</Label>
                                <Input
                                    type="number"
                                    value={localProcessData.mixDryBulb}
                                    onChange={(e) => handleMixDryBulbChange(e.target.value)}
                                    placeholder={isSI ? "30.0" : "85.0"}
                                    min={isSI ? "-100" : "-148"}
                                    max={isSI ? "200" : "392"}
                                    step="any"
                                />
                            </div>
                            <div className="space-y-1">
                                <Select value={localProcessData.mixFlowRateType} onValueChange={handleMixFlowRateTypeChange}>
                                    <SelectTrigger className="w-full py-1 h-9" aria-label="Flow Rate Type">
                                        <SelectValue placeholder="volumetric_flow_rate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Select Input Type</SelectLabel>
                                            <SelectItem value="total_air_mass_flow_rate">Total air mass flow rate [{massFlowRateUnit}]</SelectItem>
                                            <SelectItem value="dry_air_mass_flow_rate">Dry air mass flow rate [{massFlowRateUnit}]</SelectItem>
                                            <SelectItem value="volumetric_flow_rate">Volumetric flow rate [{volumetricFlowRateUnit}]</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    value={localProcessData.mixFlowRateValue}
                                    onChange={(e) => handleMixFlowRateValueChange(e.target.value)}
                                    min={0.0}
                                    step="any"
                                />
                            </div>
                            <div className="space-y-1">
                                <Select value={localProcessData.mixHumidityType} onValueChange={handleMixHumidityTypeChange}>
                                    <SelectTrigger className="w-full py-1 h-9" aria-label="Input Type">
                                        <SelectValue placeholder="relative_humidity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Select Input Type</SelectLabel>
                                            <SelectItem value="humidity_ratio">Humidity Ratio [{humidityRatioUnit}]</SelectItem>
                                            <SelectItem value="relative_humidity">Relative Humidity [%]</SelectItem>
                                            <SelectItem value="t_wet_bulb">Wet-bulb Temperature [{temperatureUnit}]</SelectItem>
                                            <SelectItem value="t_dew_point">Dew-point Temperature [{temperatureUnit}]</SelectItem>
                                            <SelectItem value="specific_enthalpy">Specific Enthalpy [{enthalpyUnit}]</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    value={localProcessData.mixHumidityValue}
                                    onChange={(e) => handleMixHumidityValueChange(e.target.value)}
                                    min={min}
                                    max={max}
                                    step="any"
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