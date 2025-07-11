import { useState, useEffect, useRef } from "react";
import Initialization, { InitializationRef } from "./components/Initialization";
import Chart from "./components/Chart";
import Header from "./components/Header";
import StateTable from "./components/StateTable";
import init, { relativeHumidityLine, specificEnthalpyLine, WasmMoistAir } from './lib/psychroid';
import ProcessArray, { ProcessArrayRef } from "./components/ProcessArray";
// import CookieConsent from './components/CookieConsent';

export type Point = {
  x: number; // Dry-bulb temperature in °C 
  y: number; // Humidity ratio in kg/kg
};

export type Line = {
  data: Point[];
  label: string;
};

export type InitialState = {
  pressure: number;
  flowRateType: string;
  flowRateValue: number;
  parameterType1: string; // t_dry_bulb
  value1: number;
  parameterType2: string; // humidity_ratio, relative_humidity, t_wet_bulb, t_dew_point, enthalpy
  value2: number;
};

export type State = {
  id: number;
  tDryBulb: number;
  humidityRatio: number;
  tWetBulb: number;
  tDewPoint: number;
  relativeHumidity: number;
  enthalpy: number;
  density: number;
  dryAirMassFlowRate: number;
}

export type Process = {
  id: number;
  processType: string;  // heating, cooling, humidification, mixing
  inputType: string;
  value: number;
  mixDryBulb: number;
  mixFlowRateType: string;
  mixFlowRateValue: number;
  mixHumidityType: string;
  mixHumidityValue: number;
};

export type ChartSettings = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

// Default initial state in SI units
const initialStateDefaultSI: InitialState = {
  pressure: 101325,                       // 101325 Pa
  flowRateType: "volumetric_flow_rate", 	// volumetric_flow_rate
  flowRateValue: 1700.0,                  // 1500 m³/h
  parameterType1: "t_dry_bulb",           // t_dry_bulb
  value1: 20.0,                           // 20 °C
  parameterType2: "relative_humidity",    // relative_humidity
  value2: 50.0                            // 50 % 
};

// Default initial state in IP units
const initialStateDefaultIP: InitialState = {
  pressure: 14.696,                       // 14.696 psi
  flowRateType: "volumetric_flow_rate",   // volumetric_flow_rate
  flowRateValue: 1000.0,                  // 1000 cfm (ft³/min)
  parameterType1: "t_dry_bulb",           // t_dry_bulb
  value1: 68.0,                           // 68 °F
  parameterType2: "relative_humidity",    // relative_humidity
  value2: 50.0                            // 50 %
};

const App = () => {
  // Unit system
  const [isSI, setIsSI] = useState(true);
  // Ref for Initialization component
  const initializationRef = useRef<InitializationRef>(null);
  // Ref for ProcessArray component
  const ProcessArrayRef = useRef<ProcessArrayRef>(null);
  // WASM init state
  const [wasmInitialized, setWasmInitialized] = useState(false);
  // Chart lines
  const [rhLines, setRhLines] = useState<Line[]>([]);
  const [enthalpyLines, setEnthalpyLines] = useState<Line[]>([]);
  // initial state
  const [initialState, setInitialState] = useState<InitialState>(initialStateDefaultSI);
  // Process array
  const [processes, setProcesses] = useState<Process[]>([]);
  // State array
  const [states, setStates] = useState<Array<State>>([]);

  // Load WASM module
  useEffect(() => {
    async function loadWasm() {
      try {
        console.log("Starting WASM initialization");
        await init();
        console.log("WASM initialized");
        setWasmInitialized(true);
      } catch (err) {
        console.error("Failed to load WASM:", err);
      }
    }
    loadWasm();
  }, []);

  // Get relative humidity lines using WASM module
  const getRhLines = (): Line[] => {
    const rhValues = Array.from({ length: 10 }, (_, i) => (i + 1) * 0.1);
    const rhLines: Line[] = [];

    rhValues.forEach(rh => {
      const wasmPoints = relativeHumidityLine(
        rh,                       // RH value (0.1 to 1.0)
        isSI ? 101325 : 14.696,   // Standard pressure
        isSI ? -15 : 5,           // Min dry-bulb temperature
        isSI ? 40 : 104,          // Max dry-bulb temperature
        isSI                      // Use SI or IP units
      );

      rhLines.push({
        data: wasmPoints,
        label: `${Math.round(rh * 100)}%`
      });
    });

    return rhLines;
  };

  // Get enthalpy lines using WASM module
  const getEnthalpyLines = (): Line[] => {
    // enthalpy values: -10, 0, ... 110 kJ/kg_da
    // enthalpy values: 5, 10, ... 50 Btu/lb_da
    const enthalpyValues = isSI
      ? Array.from({ length: 13 }, (_, i) => (i - 1) * 10)
      : Array.from({ length: 11 }, (_, i) => (i + 1) * 5);
    const enthalpyLines: Line[] = [];

    enthalpyValues.forEach(enthalpy => {
      const wasmPoints = specificEnthalpyLine(
        enthalpy,                 // Enthalpy value
        isSI ? 101325 : 14.696,   // Standard pressure
        isSI ? -15 : 5,           // Min dry-bulb temperature
        isSI ? 40 : 104,          // Max dry-bulb temperature
        isSI                      // Use SI units
      );

      enthalpyLines.push({
        data: wasmPoints,
        label: isSI ? `${enthalpy} kJ/kg` : `${enthalpy} Btu/lb`
      });
    });

    return enthalpyLines;
  };

  // Update rhLines whenever wasmInitialized, initialState, or isSI changes
  useEffect(() => {
    if (wasmInitialized) {
      setRhLines(getRhLines());
      setEnthalpyLines(getEnthalpyLines());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasmInitialized, initialState, isSI]);

  // Reset initialState and processes when switching between SI and IP units
  useEffect(() => {
    setInitialState(isSI ? initialStateDefaultSI : initialStateDefaultIP);
    setProcesses([]);
  }, [isSI]);

  const handleInitialize = (initialStateInput: InitialState) => {
    setInitialState(initialStateInput);
  };

  const handleApplyProcesses = (processes: Process[]) => {
    setProcesses(processes);
  };

  const resetProcessById = (id: number) => {
    const updatedProcesses = processes.map(process => {
      if (process.id === id) {
        // For given process id, reset to the default process 
        return {
          ...process,
          processType: "Heating",
          inputType: "Power",
          value: 0.0
        };
      }
      // For other processes, return the original process
      return process;
    });
    // Set new process array
    setProcesses(updatedProcesses);
  };

  const calculateNextState = (prev: State, proc: Process) => {
    let moistAir: WasmMoistAir = WasmMoistAir.fromHumidityRatio(prev.tDryBulb, prev.humidityRatio, initialState.pressure, isSI);
    let newDryAirMassFlowRate = prev.dryAirMassFlowRate;

    try {
      if (proc.processType === "Heating" && proc.inputType === "Power") {
        moistAir.heatingPower(prev.dryAirMassFlowRate, proc.value);
      } else if (proc.processType === "Heating" && proc.inputType === "ΔT") {
        const q = moistAir.heatingDeltaTemperature(prev.dryAirMassFlowRate, proc.value);
        console.log("Heating with ΔT:", proc.value, moistAir.tDryBulb(), q);
      } else if (proc.processType === "Cooling" && proc.inputType === "Power") {
        moistAir.coolingPower(prev.dryAirMassFlowRate, proc.value);
      } else if (proc.processType === "Cooling" && proc.inputType === "ΔT") {
        const q = moistAir.coolingDeltaTemperature(prev.dryAirMassFlowRate, proc.value);
        console.log("Cooling with ΔT:", proc.value, moistAir.tDryBulb(), q);
      } else if (proc.processType === "Humidify" && proc.inputType === "ΔW Adiabatic") {
        moistAir.humidifyAdiabatic(prev.dryAirMassFlowRate, proc.value);
      } else if (proc.processType === "Humidify" && proc.inputType === "ΔW Isothermal") {
        moistAir.humidifyIsothermal(prev.dryAirMassFlowRate, proc.value);
      } else if (proc.processType === "Mixing") {
        let moistAir2: WasmMoistAir;
        if (proc.mixHumidityType === "humidity_ratio") {
          moistAir2 = WasmMoistAir.fromHumidityRatio(proc.mixDryBulb, proc.mixHumidityValue, initialState.pressure, isSI);
        } else if (proc.mixHumidityType === "relative_humidity") {
          moistAir2 = WasmMoistAir.fromRelativeHumidity(proc.mixDryBulb, proc.mixHumidityValue * 0.01, initialState.pressure, isSI);
        } else if (proc.mixHumidityType === "t_wet_bulb") {
          moistAir2 = WasmMoistAir.fromTWetBulb(proc.mixDryBulb, proc.mixHumidityValue, initialState.pressure, isSI);
        } else if (proc.mixHumidityType === "t_dew_point") {
          moistAir2 = WasmMoistAir.fromTDewPoint(proc.mixDryBulb, proc.mixHumidityValue, initialState.pressure, isSI);
        } else if (proc.mixHumidityType === "specific_enthalpy") {
          moistAir2 = WasmMoistAir.fromSpecificEnthalpy(proc.mixDryBulb, proc.mixHumidityValue, initialState.pressure, isSI);
        } else {
          throw new Error("Invalid mixing humidity type");
        }
        let dryAirMassFlowRate2: number;
        if (proc.mixFlowRateType === "total_air_mass_flow_rate") {
          dryAirMassFlowRate2 = proc.mixFlowRateValue * (1 + moistAir.humidityRatio());
        } else if (proc.mixFlowRateType === "dry_air_mass_flow_rate") {
          dryAirMassFlowRate2 = initialState.flowRateValue;
        } else if (proc.mixFlowRateType === "volumetric_flow_rate") {
          dryAirMassFlowRate2 = isSI ?
            proc.mixFlowRateValue / 3600.0 * moistAir2.density() / (1 + moistAir2.humidityRatio()) : // kg/s (SI)
            proc.mixFlowRateValue * 60.0 * moistAir2.density() / (1 + moistAir2.humidityRatio());    // lb/h (IP)
        } else {
          throw new Error("Invalid flow rate type");
        }
        newDryAirMassFlowRate = moistAir.mixing(prev.dryAirMassFlowRate, moistAir2, dryAirMassFlowRate2);
      }
    } catch (err) {
      console.error(`Error in process ${proc.id} (${proc.processType}):`, err);
      // Reset process which caused an error
      resetProcessById(proc.id);
      // Reset ProcessCard form UI
      ProcessArrayRef.current?.resetProcessById(proc.id);
      // return previous state (only id is updated)
      return { ...prev, id: prev.id + 1 };
    }

    const next = {
      id: prev.id + 1,
      tDryBulb: moistAir.tDryBulb(),
      humidityRatio: moistAir.humidityRatio(),
      tWetBulb: moistAir.tWetBulb(),
      tDewPoint: moistAir.tDewPoint(),
      relativeHumidity: moistAir.relativeHumidity(),
      enthalpy: moistAir.specificEnthalpy(),
      density: moistAir.density(),
      dryAirMassFlowRate: newDryAirMassFlowRate
    } as State;
    return next;
  };

  // Update states whenever initialState or processes changes
  useEffect(() => {
    if (wasmInitialized) {
      const stateArray: State[] = [];

      let moistAir: WasmMoistAir;
      let dryAirMassFlowRate: number;
      try {
        // Create moist air object based on the second input parameter
        if (initialState.parameterType2 === "humidity_ratio") {
          moistAir = WasmMoistAir.fromHumidityRatio(initialState.value1, initialState.value2, initialState.pressure, isSI);
        } else if (initialState.parameterType2 === "relative_humidity") {
          moistAir = WasmMoistAir.fromRelativeHumidity(initialState.value1, initialState.value2 * 0.01, initialState.pressure, isSI);
        } else if (initialState.parameterType2 === "t_wet_bulb") {
          moistAir = WasmMoistAir.fromTWetBulb(initialState.value1, initialState.value2, initialState.pressure, isSI);
        } else if (initialState.parameterType2 === "t_dew_point") {
          moistAir = WasmMoistAir.fromTDewPoint(initialState.value1, initialState.value2, initialState.pressure, isSI);
        } else if (initialState.parameterType2 === "specific_enthalpy") {
          moistAir = WasmMoistAir.fromSpecificEnthalpy(initialState.value1, initialState.value2, initialState.pressure, isSI);
        } else {
          throw new Error("Invalid parameter type");
        }

        // Calculate dry air mass flow rate based on the first input parameter
        if (initialState.flowRateType === "total_air_mass_flow_rate") {
          dryAirMassFlowRate = initialState.flowRateValue * (1 + moistAir.humidityRatio());
        } else if (initialState.flowRateType === "dry_air_mass_flow_rate") {
          dryAirMassFlowRate = initialState.flowRateValue;
        } else if (initialState.flowRateType === "volumetric_flow_rate") {
          dryAirMassFlowRate = isSI ?
            initialState.flowRateValue / 3600.0 * moistAir.density() / (1 + moistAir.humidityRatio()) : // kg/s (SI)
            initialState.flowRateValue * 60.0 * moistAir.density() / (1 + moistAir.humidityRatio());    // lb/h (IP)
        } else {
          throw new Error("Invalid flow rate type");
        }

      } catch (err) {
        console.error("Failed to create moist air object:", err);
        // Reset InitialState
        if (isSI) {
          setInitialState(initialStateDefaultSI);
        } else {
          setInitialState(initialStateDefaultIP);
        }
        // Reset Initialization form UI
        initializationRef.current?.resetForm();
        return
      }

      // Add initial state to the state array
      const state0: State = {
        id: 0,
        tDryBulb: moistAir.tDryBulb(),
        humidityRatio: moistAir.humidityRatio(),
        tWetBulb: moistAir.tWetBulb(),
        tDewPoint: moistAir.tDewPoint(),
        relativeHumidity: moistAir.relativeHumidity(),
        enthalpy: moistAir.specificEnthalpy(),
        density: moistAir.density(),
        dryAirMassFlowRate: dryAirMassFlowRate,
      }
      stateArray.push(state0);

      // Apply processes sequentially
      processes.map((proc, index) => {
        const prevState = stateArray[index];
        const nextState = calculateNextState(prevState, proc);
        stateArray.push(nextState);
      })

      setStates(stateArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState, wasmInitialized, processes]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isSI={isSI} setIsSI={setIsSI} />
      <main className="flex-grow pt-2 px-6 pb-6">
        <div className="w-full mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1920px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-1 md:col-span-7">
              <Chart isSI={isSI} rhLines={rhLines} enthalpyLines={enthalpyLines} states={states} />
              <StateTable isSI={isSI} states={states} />
            </div>
            <div className="col-span-1 md:col-span-5">
              <Initialization
                ref={initializationRef}
                onInitialize={handleInitialize}
                isSI={isSI}
              />
              <ProcessArray
                onApplyProcesses={handleApplyProcesses}
                ref={ProcessArrayRef}
                isSI={isSI}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer with centered content */}
      <footer className="border-t py-2 px-6">
        <div className="w-full mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1920px] flex justify-start items-center">
          <div className="flex space-x-6 items-center">
            <a
              href="https://thermocraft.space/"
              className="text-sm text-gray-600 hover:underline"
            >
              © {new Date().getFullYear()} K. Sasaki
            </a>
            <span className="text-gray-300">|</span>
            <a href="/contact/" className="text-sm text-gray-600 hover:underline">
              Contact
            </a>
            <span className="text-gray-300">|</span>
            <a href="/terms/" className="text-sm text-gray-600 hover:underline">
              Terms & Conditions
            </a>
          </div>
        </div>
      </footer>

      {/* <CookieConsent /> */}
    </div>
  );
}
export default App;