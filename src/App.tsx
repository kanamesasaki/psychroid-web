import React, { useState, useEffect, useRef } from "react";
import Initialization, { InitializationRef } from "./components/Initialization";
import Chart from "./components/Chart";
import Header from "./components/Header";
import StateTable from "./components/StateTable";
import ContactModal from './components/ContactModal';
import init, { relativeHumidityLine, specificEnthalpyLine, WasmMoistAir } from './lib/psychroid';
import ProcessArray from "./components/ProcessArray";
import CookieConsent from './components/CookieConsent';

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
  processType: string; // heating, cooling, humidification
  inputType: string;
  value: number;
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
  flowRateValue: 1500.0,                  // 1500 m³/h
  parameterType1: "t_dry_bulb",           // t_dry_bulb
  value1: 30.0,                           // 30 °C
  parameterType2: "relative_humidity",    // relative_humidity
  value2: 50.0                            // 50 % 
};

// // Default initial state in IP units
// const initialStateDefaultIP: InitialState = {
//   pressure: 14.696,                       // 14.696 psi
//   flowRateType: "volumetric_flow_rate",   // volumetric_flow_rate
//   flowRateValue: 1000.0,                  // 1000 cfm (ft³/min)
//   parameterType1: "t_dry_bulb",           // t_dry_bulb
//   value1: 85.0,                           // 85 °F
//   parameterType2: "relative_humidity",    // relative_humidity
//   value2: 50.0                            // 50 %
// };

const App = () => {
  // Unit system
  const [isSI, _] = useState(true);
  // Ref for Initialization component
  const initializationRef = useRef<InitializationRef>(null);
  // WASM init state
  const [wasmInitialized, setWasmInitialized] = React.useState(false);
  // Chart lines
  const [rhLines, setRhLines] = React.useState<Line[]>([]);
  const [enthalpyLines, setEnthalpyLines] = React.useState<Line[]>([]);
  // initial state
  const [initialState, setInitialState] = React.useState<InitialState>(initialStateDefaultSI);
  // Process array
  const [processes, setProcesses] = useState<Process[]>([]);
  // State array
  const [states, setStates] = useState<Array<State>>([]);
  // Contact Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
        initialState.pressure,    // Standard pressure
        isSI ? -15 : 5,           // Min dry-bulb temperature
        isSI ? 40 : 104,          // Max dry-bulb temperature
        isSI                      // Use SI units
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
      : Array.from({ length: 10 }, (_, i) => (i + 1) * 5);
    const enthalpyLines: Line[] = [];

    enthalpyValues.forEach(enthalpy => {
      const wasmPoints = specificEnthalpyLine(
        enthalpy,                 // Enthalpy value
        initialState.pressure,    // Standard pressure
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
  }, [wasmInitialized, initialState]);

  const handleInitialize = (initialStateInput: InitialState) => {
    setInitialState(initialStateInput);
  };

  const handleApplyProcesses = (processes: Process[]) => {
    setProcesses(processes);
  };

  const calculateNextState = (prev: State, proc: Process) => {
    const moistAir: WasmMoistAir = WasmMoistAir.fromHumidityRatio(prev.tDryBulb, prev.humidityRatio, initialState.pressure, true);

    try {
      if (proc.processType === "Heating" && proc.inputType === "Power") {
        moistAir.heatingPower(prev.dryAirMassFlowRate, proc.value);
      } else if (proc.processType === "Heating" && proc.inputType === "ΔT") {
        const q = moistAir.heatingDeltaTemperature(prev.dryAirMassFlowRate, proc.value);
        console.log("Heating with ΔT:", proc.value, moistAir.tDryBulb(), q);
      } else if (proc.processType === "Cooling" && proc.inputType === "Power") {
        moistAir.coolingPower(prev.dryAirMassFlowRate, proc.value);
      } else if (proc.processType === "Cooling" && proc.inputType === "ΔT") {
        moistAir.coolingDeltaTemperature(prev.dryAirMassFlowRate, proc.value);
      } else if (proc.processType === "Humidify" && proc.inputType === "ΔW Adiabatic") {
        moistAir.humidifyAdiabatic(prev.dryAirMassFlowRate, proc.value);
      } else if (proc.processType === "Humidify" && proc.inputType === "ΔW Isothermal") {
        moistAir.humidifyIsothermal(prev.dryAirMassFlowRate, proc.value);
      }
    } catch (err) {
      console.error(`Error in process ${proc.id} (${proc.processType}):`, err);
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
      dryAirMassFlowRate: prev.dryAirMassFlowRate
    } as State;
    return next;
  };

  // Update states whenever initialState changes
  useEffect(() => {
    if (wasmInitialized) {
      const stateArray: State[] = [];

      let moistAir: WasmMoistAir;
      let dryAirMassFlowRate: number;
      try {
        // Create moist air object based on the second input parameter
        if (initialState.parameterType2 === "humidity_ratio") {
          moistAir = WasmMoistAir.fromHumidityRatio(initialState.value1, initialState.value2, initialState.pressure, true);
        } else if (initialState.parameterType2 === "relative_humidity") {
          moistAir = WasmMoistAir.fromRelativeHumidity(initialState.value1, initialState.value2 * 0.01, initialState.pressure, true);
        } else if (initialState.parameterType2 === "t_wet_bulb") {
          moistAir = WasmMoistAir.fromTWetBulb(initialState.value1, initialState.value2, initialState.pressure, true);
        } else if (initialState.parameterType2 === "t_dew_point") {
          moistAir = WasmMoistAir.fromTDewPoint(initialState.value1, initialState.value2, initialState.pressure, true);
        } else if (initialState.parameterType2 === "specific_enthalpy") {
          moistAir = WasmMoistAir.fromSpecificEnthalpy(initialState.value1, initialState.value2, initialState.pressure, true);
        } else {
          throw new Error("Invalid parameter type");
        }

        if (initialState.flowRateType === "total_air_mass_flow_rate") {
          dryAirMassFlowRate = initialState.flowRateValue * (1 + moistAir.humidityRatio());
        } else if (initialState.flowRateType === "dry_air_mass_flow_rate") {
          dryAirMassFlowRate = initialState.flowRateValue;
        } else if (initialState.flowRateType === "volumetric_flow_rate") {
          dryAirMassFlowRate = initialState.flowRateValue / 3600.0 * moistAir.density() / (1 + moistAir.humidityRatio());
        } else {
          throw new Error("Invalid flow rate type");
        }

      } catch (err) {
        console.error("Failed to create moist air object:", err);
        setInitialState(initialStateDefaultSI);
        // initializationRef.current?.resetForm();
        return
      }

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

      processes.map((proc, index) => {
        const prevState = stateArray[index];
        const nextState = calculateNextState(prevState, proc);
        // const nextState = prevState;
        stateArray.push(nextState);
      })

      setStates(stateArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState, wasmInitialized, processes]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onContactClick={() => setIsContactModalOpen(true)} />

      <main className="flex-grow pt-2 px-6 pb-6">
        <div className="w-full mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1920px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-1 md:col-span-7">
              <Chart rhLines={rhLines} enthalpyLines={enthalpyLines} states={states} />
              <StateTable states={states} />
            </div>
            <div className="col-span-1 md:col-span-5">
              <Initialization
                ref={initializationRef}
                onInitialize={handleInitialize}
              />
              <ProcessArray onApplyProcesses={handleApplyProcesses} />
            </div>
          </div>
        </div>
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <CookieConsent />
    </div>
  );
}
export default App;