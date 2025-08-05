import { InitialState } from '../App';
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    // CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";

export type InitializationRef = {
    resetForm: () => void;
};

// Initialization component is defined as a forwardRef
// forwardRef<RefType, PropsType>((props, ref) => { ... })
//
// Generic types:
// RefType: InitializationRef
// PropsType: { onInitialize: (initialStateInput: InitialState) => void, isSI: boolean }
//
// Component variables:
// props: { onInitialize: (initialStateInput: InitialState) => void, isSI: boolean }
// ref: React.ForwardedRef<InitializationRef>
// 
const Initialization = forwardRef<
    InitializationRef,
    {
        onInitialize: (initialStateInput: InitialState) => void;
        isSI: boolean;
    }
>(
    ({ onInitialize, isSI }, ref: React.ForwardedRef<InitializationRef>) => {
        const defaultValues = {
            pressure: isSI ? "101325.0" : "14.696",
            flowRateType: "volumetric_flow_rate",
            flowRateValue: isSI ? "1700.0" : "1000.0",
            value1: isSI ? "20.0" : "68.0",
            inputType2: "relative_humidity",
            value2: "50.0"
        };

        const [pressureInput, setPressureInput] = useState<string>(defaultValues.pressure);
        const [flowRateType, setFlowRateType] = useState<string>(defaultValues.flowRateType);
        const [flowRateInput, setFlowRateInput] = useState<string>(defaultValues.flowRateValue);
        const [inputValue1, setInputValue1] = useState<string>(defaultValues.value1);
        const [inputType2, setInputType2] = useState<string>(defaultValues.inputType2);
        const [inputValue2, setInputValue2] = useState<string>(defaultValues.value2);

        const resetForm = () => {
            setPressureInput(defaultValues.pressure);
            setFlowRateType(defaultValues.flowRateType);
            setFlowRateInput(defaultValues.flowRateValue);
            setInputValue1(defaultValues.value1);
            setInputType2(defaultValues.inputType2);
            setInputValue2(defaultValues.value2);
        };

        useImperativeHandle(ref, () => ({
            resetForm,
        }));

        // Update values when unit system changes
        React.useEffect(() => {
            setPressureInput(isSI ? "101325.0" : "14.696");
            setFlowRateType("volumetric_flow_rate");
            setFlowRateInput(isSI ? "1700.0" : "1000.0");
            setInputValue1(isSI ? "20.0" : "68.0");
            setInputType2("relative_humidity");
            setInputValue2("50.0");
        }, [isSI]);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const initialStateInput: InitialState = {
                pressure: Number(pressureInput),
                flowRateType: flowRateType,
                flowRateValue: Number(flowRateInput),
                parameterType1: "t_dry_bulb",
                value1: Number(inputValue1),
                parameterType2: inputType2,
                value2: Number(inputValue2),
            };
            onInitialize(initialStateInput);
        };

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

        const { min, max } = getRangeForInputType(inputType2);

        // Unit system dependent labels
        const humidityRatioUnit = isSI ? "kg/kg" : "lb/lb";
        const pressureUnit = isSI ? "Pa" : "Psi";
        const temperatureUnit = isSI ? "°C" : "°F";
        const enthalpyUnit = isSI ? "kJ/kg" : "Btu/lb";
        const volumetricFlowRateUnit = isSI ? "m³/h" : "ft³/min";
        const massFlowRateUnit = isSI ? "kg/s" : "lb/s";

        return (
            <Card className="w-full mb-4">
                <CardHeader className="pb-0 pt-0 -mb-4 -mt-2">
                    <CardTitle className="text-lg">
                        Initialization
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-0 pt-0 -mb-2">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="mb-1.5">Pressure [{pressureUnit}]</Label>
                                <Input
                                    type="number"
                                    value={pressureInput}
                                    onChange={(e) => setPressureInput(e.target.value)}
                                    placeholder={isSI ? "101325.0" : "14.696"}
                                />
                            </div>
                            <div>
                                <Label className="mb-1.5">Dry-bulb Temperature [{temperatureUnit}]</Label>
                                <Input
                                    type="number"
                                    value={inputValue1}
                                    onChange={(e) => setInputValue1(e.target.value)}
                                    placeholder={isSI ? "30.0" : "85.0"}
                                    min={isSI ? "-100" : "-148"}
                                    max={isSI ? "200" : "392"}
                                    step="any"
                                />
                            </div>
                            <div className="space-y-1">
                                <Select onValueChange={setFlowRateType} value={flowRateType}>
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
                                    value={flowRateInput}
                                    onChange={(e) => setFlowRateInput(e.target.value)}
                                    min={0.0}
                                    step="any"
                                />
                            </div>
                            <div className="space-y-1">
                                <Select onValueChange={setInputType2} value={inputType2}>
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
                                    value={inputValue2}
                                    onChange={(e) => setInputValue2(e.target.value)}
                                    min={min}
                                    max={max}
                                    step="any"
                                />
                            </div>
                            <div className="flex items-center h-full">
                            </div>
                            <div>
                                <Button type="submit" className="w-full cursor-pointer">Set Initial State</Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    }
);

Initialization.displayName = 'Initialization';
export default Initialization;