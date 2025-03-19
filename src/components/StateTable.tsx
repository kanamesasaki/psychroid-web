import React from "react";
import { State } from '../App';
import * as Tooltip from '@radix-ui/react-tooltip';

interface StateTableProps {
    states: Array<State>;
}

// tooltip for table header
const headerTooltips = {
    "id": "State identifier number",
    "tdb": "Dry-bulb temperature [°C]",
    "w": "Humidity ratio [kg/kg]",
    "rh": "Relative humidity [%]",
    "h": "Specific enthalpy [kJ/kg]",
    "twb": "Wet-bulb temperature [°C]",
    "tdew": "Dew point temperature [°C]",
    "rho": "Density of moist air [kg/m³]",
    "vdot": "Volumetric flow rate [m³/h]",
};

const HeaderTooltip = ({ id, children }: { id: keyof typeof headerTooltips, children: React.ReactNode }) => (
    <Tooltip.Root>
        <Tooltip.Trigger asChild>
            <th className="px-4 py-2 border-b text-left font-bold relative group cursor-pointer">
                {children}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </th>
        </Tooltip.Trigger>
        <Tooltip.Portal>
            <Tooltip.Content
                className="bg-slate-800 text-white p-2 rounded-md shadow-lg max-w-xs z-50"
                sideOffset={5}
            >
                {headerTooltips[id]}
                <Tooltip.Arrow className="fill-slate-800" />
            </Tooltip.Content>
        </Tooltip.Portal>
    </Tooltip.Root>
);

const StateTable: React.FC<StateTableProps> = ({ states }) => {
    return (
        <Tooltip.Provider>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead>
                        <tr>
                            <HeaderTooltip id="id">ID</HeaderTooltip>
                            <HeaderTooltip id="tdb">T<sub>db</sub> [°C]</HeaderTooltip>
                            <HeaderTooltip id="w">W [kg/kg]</HeaderTooltip>
                            <HeaderTooltip id="rh">RH [%]</HeaderTooltip>
                            <HeaderTooltip id="h">h [kJ/kg]</HeaderTooltip>
                            <HeaderTooltip id="twb">T<sub>wb</sub> [°C]</HeaderTooltip>
                            <HeaderTooltip id="tdew">T<sub>dew</sub> [°C]</HeaderTooltip>
                            <HeaderTooltip id="rho">ρ [kg/m³]</HeaderTooltip>
                            <HeaderTooltip id="vdot">V&#x0307; [m³/h]</HeaderTooltip>
                        </tr>
                    </thead>
                    <tbody>
                        {states.map((state, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 border-b">{index}</td>
                                <td className="px-4 py-2 border-b">{state.tDryBulb.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">{state.humidityRatio.toFixed(4)}</td>
                                <td className="px-4 py-2 border-b">{(state.relativeHumidity * 100).toFixed(1)}</td>
                                <td className="px-4 py-2 border-b">{state.enthalpy.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">{state.tWetBulb.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">{state.tDewPoint.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">{state.density.toFixed(3)}</td>
                                <td className="px-4 py-2 border-b">{(state.dryAirMassFlowRate * 3600.0 * (1.0 + state.humidityRatio) / state.density).toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Tooltip.Provider>
    );
};

export default StateTable;