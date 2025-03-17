"use client";

import React from "react";
import { State } from '../App';

interface StateTableProps {
    states: Array<State>;
}

const ProcessTable: React.FC<StateTableProps> = ({ states }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left font-bold">ID</th>
                        <th className="px-4 py-2 border-b text-left font-bold">T<sub>db</sub> [°C]</th>
                        <th className="px-4 py-2 border-b text-left font-bold">W [kg/kg]</th>
                        <th className="px-4 py-2 border-b text-left font-bold">RH [%]</th>
                        <th className="px-4 py-2 border-b text-left font-bold">h [kJ/kg]</th>
                        <th className="px-4 py-2 border-b text-left font-bold">T<sub>wb</sub> [°C]</th>
                        <th className="px-4 py-2 border-b text-left font-bold">T<sub>dew</sub> [°C]</th>
                        <th className="px-4 py-2 border-b text-left font-bold">ρ [kg/m³]</th>
                        <th className="px-4 py-2 border-b text-left font-bold">V&#x0307; [m³/h]</th>
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
    );
};

export default ProcessTable;