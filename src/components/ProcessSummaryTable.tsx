import React from "react";
import { ProcessSummary } from '../App';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ProcessSummaryTableProps {
    isSI: boolean;
    processSummaries: Array<ProcessSummary>;
}

const ProcessSummaryTable: React.FC<ProcessSummaryTableProps> = ({ isSI, processSummaries }) => {
    // tooltip for table header
    const headerTooltips = {
        "process": "Process step identifier",
        "type": "Type of psychrometric process",
        "power": "Change of enthalpy",
        "deltaW": "Change of water amount",
        "massFlow": "Change of dry air mass flow rate",
    };

    const HeaderTooltip = ({ id, children }: { id: keyof typeof headerTooltips, children: React.ReactNode }) => (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <th className="px-4 py-2 border-b text-left font-bold relative group cursor-pointer">
                    {children}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
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

    // Table header with tooltips
    const tableHeader = (
        <thead>
            <tr>
                <HeaderTooltip id="process">Process</HeaderTooltip>
                <HeaderTooltip id="type">Type</HeaderTooltip>
                <HeaderTooltip id="power">Δh [{isSI ? "kW" : "Btu/h"}]</HeaderTooltip>
                <HeaderTooltip id="deltaW">ΔW [{isSI ? 'kg' : 'lb'}<sub>w</sub>{isSI ? '/s' : '/h'}]</HeaderTooltip>
                <HeaderTooltip id="massFlow">
                    Δm&#x0307;<sub>da</sub> [{isSI ? 'kg' : 'lb'}<sub>da</sub>{isSI ? '/s' : '/h'}]
                </HeaderTooltip>
            </tr>
        </thead>
    );

    const columnsCount = 5;

    if (processSummaries.length === 0) {
        return (
            <Tooltip.Provider>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Process Summary</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 text-sm">
                            {tableHeader}
                            <tbody>
                                <tr>
                                    <td colSpan={columnsCount} className="px-4 py-2 text-center text-gray-500 border-b">
                                        No data available. Add processes and click "Apply Process" to see the summary.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Tooltip.Provider>
        );
    }

    return (
        <Tooltip.Provider>
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Process Summary</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 text-sm">
                        {tableHeader}
                        <tbody>
                            {processSummaries.map((summary, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border-b">{summary.id}→{summary.id + 1}</td>
                                    <td className="px-4 py-2 border-b">{summary.processType}</td>
                                    <td className="px-4 py-2 border-b">{summary.enthalpyChange.toFixed(2)}</td>
                                    <td className="px-4 py-2 border-b">{summary.humidityChange.toFixed(4)}</td>
                                    <td className="px-4 py-2 border-b">{summary.dryAirChange.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Tooltip.Provider>
    );
};

export default ProcessSummaryTable;
