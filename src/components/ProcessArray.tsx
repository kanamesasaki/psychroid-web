import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import ProcessCard, { ProcessCardRef } from "./ProcessCard";
import { Button } from "./ui/button";
import { SquarePlus } from "lucide-react";
import { Process } from "../App";

export type ProcessArrayRef = {
    resetProcessById: (id: number) => void;
};

const ProcessArray = forwardRef<ProcessArrayRef, { onApplyProcesses: (processes: Process[]) => void }>(
    ({ onApplyProcesses }, ref: React.ForwardedRef<ProcessArrayRef>) => {
        const [processes, setProcesses] = useState<Process[]>([
            { id: 0, processType: "Heating", inputType: "Power", value: 0.0 } as Process,
        ]);

        const addProcessCard = () => {
            const newProcess: Process = { id: processes.length, processType: "Heating", inputType: "Power", value: 0.0 };
            setProcesses((prev) => [...prev, newProcess]);
        };

        const updateProcess = (updatedProcess: Process) => {
            setProcesses((prev) =>
                prev.map((proc) => (proc.id === updatedProcess.id ? updatedProcess : proc))
            );
        };

        const handleApplyProcess = () => {
            // update processes in page.tsx
            onApplyProcesses(processes);
        };

        const processCardRefs = useRef<ProcessCardRef[]>([]);

        const resetProcessById = (id: number) => {
            if (processCardRefs.current[id]) {
                processCardRefs.current[id]?.resetForm();
            }
        }

        useImperativeHandle(ref, () => ({
            resetProcessById,
        }));

        return (
            <div className="flex flex-col gap-4">
                {processes.map((proc) => (
                    <ProcessCard
                        key={proc.id}
                        processData={proc}
                        onChange={updateProcess}
                        ref={el => {
                            if (el) processCardRefs.current[proc.id] = el;
                        }}
                    />
                ))}
                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={addProcessCard} className="text-sm px-3 py-1 cursor-pointer">
                        <SquarePlus className="mr-1" />
                        Add Process
                    </Button>
                    <Button onClick={handleApplyProcess} className="text-sm px-3 py-1 cursor-pointer">
                        Apply Process
                    </Button>
                </div>
            </div>
        );
    }
);

export default ProcessArray;