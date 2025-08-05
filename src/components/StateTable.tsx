import React from "react";
import { State } from '../App';
import * as Tooltip from '@radix-ui/react-tooltip';

interface StateTableProps {
    isSI: boolean;
    states: Array<State>;
}

const StateTable: React.FC<StateTableProps> = ({ isSI, states }) => {
    // tooltip for table header
    const headerTooltips = {
        "id": "State identifier number",
        "tdb": "Dry-bulb temperature",
        "w": "Humidity ratio",
        "rh": "Relative humidity",
        "h": "Specific enthalpy",
        "twb": "Wet-bulb temperature",
        "tdew": "Dew point temperature",
        "rho": "Density of moist air",
        "mdot": "Mass flow rate of dry air",
        "vdot": "Volumetric flow rate",
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

    return (
        <Tooltip.Provider>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead>
                        <tr>
                            <HeaderTooltip id="id">ID</HeaderTooltip>
                            <HeaderTooltip id="tdb">T<sub>db</sub> [{isSI ? '°C' : '°F'}]</HeaderTooltip>
                            <HeaderTooltip id="w">W [{isSI ? 'kg' : 'lb'}<sub>w</sub>/{isSI ? 'kg' : 'lb'}<sub>da</sub>]</HeaderTooltip>
                            <HeaderTooltip id="rh">RH [%]</HeaderTooltip>
                            <HeaderTooltip id="h">h [{isSI ? 'kJ/kg' : 'Btu/lb'}<sub>da</sub>]</HeaderTooltip>
                            <HeaderTooltip id="twb">T<sub>wb</sub> [{isSI ? '°C' : '°F'}]</HeaderTooltip>
                            <HeaderTooltip id="tdew">T<sub>dew</sub> [{isSI ? '°C' : '°F'}]</HeaderTooltip>
                            <HeaderTooltip id="rho">ρ [{isSI ? 'kg/m³' : 'lb/ft³'}]</HeaderTooltip>
                            <HeaderTooltip id="mdot">m&#x0307;<sub>da</sub> [{isSI ? 'kg' : 'lb'}<sub>da</sub>{isSI ? '/s' : '/h'}]</HeaderTooltip>
                            <HeaderTooltip id="vdot">V&#x0307; [{isSI ? 'm³/h' : 'ft³/min'}]</HeaderTooltip>
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
                                <td className="px-4 py-2 border-b">{state.dryAirMassFlowRate.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">
                                    {isSI
                                        // SI unit: m³/h (Conversion from mass flow rate [kg/s])
                                        ? (state.dryAirMassFlowRate * 3600.0 * (1.0 + state.humidityRatio) / state.density).toFixed(1)
                                        // IP unit: ft³/min (CFM) (Conversion from  mass flow rate [lb/h])
                                        : (state.dryAirMassFlowRate / 60.0 * (1.0 + state.humidityRatio) / state.density).toFixed(1)
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Tooltip.Provider>
    );
};

export default StateTable;