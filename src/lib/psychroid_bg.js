let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_0.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}
/**
 * Generates data points for constant relative humidity line on psychrometric chart
 * <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
 *
 * # Arguments
 * * `phi` - Relative humidity [0.0-1.0]
 * * `pressure` - Atmospheric pressure [Pa] (SI) or [Psi] (IP)
 * * `unit` - Unit system (SI or IP)
 *
 * # Returns
 * Tuple of vectors (temperatures, humidity ratios):
 * - temperatures: temperature array in \\(^\\circ \\mathrm{C}\\) (SI) or \\(^\\circ \\mathrm{F}\\) (IP)
 * - humidity ratios: corresponding humidity ratio array in \\( \\mathrm{kg_w / kg_{da}} \\) (SI) or \\( \\mathrm{lb_w / lb_{da}} \\) (IP)
 * @param {number} phi
 * @param {number} pressure
 * @param {number} t_min
 * @param {number} t_max
 * @param {boolean} is_si
 * @returns {WasmPoint[]}
 */
export function relativeHumidityLine(phi, pressure, t_min, t_max, is_si) {
    const ret = wasm.relativeHumidityLine(phi, pressure, t_min, t_max, is_si);
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_0.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * Generates data points for constant specific enthalpy line on psychrometric chart
 * <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
 *
 * # Arguments
 * * `h` - Specific enthalpy \\( \\mathrm{kJ / kg_{da}} \\) (SI) or \\( \\mathrm{Btu / lb_{da}} \\) (IP)
 * * `unit` - Unit system (SI or IP)
 *
 * # Returns
 * Tuple of vectors (temperatures, humidity ratios):
 * - temperatures: temperature array in \\(^\\circ \\mathrm{C}\\) (SI) or \\(^\\circ \\mathrm{F}\\) (IP)
 * - humidity ratios: corresponding humidity ratio array in \\( \\mathrm{kg_w / kg_{da}} \\) (SI) or \\( \\mathrm{lb_w / lb_{da}} \\) (IP)
 *
 * # Formula
 * $$
 * \begin{align}
 * \\mathrm{SI:}\\quad W &= \\frac{h - 1.006~t}{2501 + 1.860~t} \\\\
 * \\mathrm{IP:}\\quad W &= \\frac{h - 0.240~t}{1061 + 0.444~t}
 * \end{align}
 * $$
 * where:
 * - \\(t\\) is dry-bulb temperature
 * - \\(h\\) is specific enthalpy
 * @param {number} h
 * @param {number} pressure
 * @param {number} t_min
 * @param {number} t_max
 * @param {boolean} is_si
 * @returns {WasmPoint[]}
 */
export function specificEnthalpyLine(h, pressure, t_min, t_max, is_si) {
    const ret = wasm.specificEnthalpyLine(h, pressure, t_min, t_max, is_si);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

const WasmMoistAirFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmmoistair_free(ptr >>> 0, 1));
/**
 * A WASM-friendly wrapper around the MoistAir struct.
 */
export class WasmMoistAir {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmMoistAir.prototype);
        obj.__wbg_ptr = ptr;
        WasmMoistAirFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmMoistAirFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmmoistair_free(ptr, 0);
    }
    /**
     * Creates a new WasmMoistAir instance from dry-bulb temperature and relative humidity.
     *
     * Arguments:
     * * `t_dry_bulb` - Dry-bulb temperature (°C or °F)
     * * `relative_humidity` - Relative humidity [0.0 - 1.0]
     * * `pressure` - Atmospheric pressure (Pa for SI, Psi for IP)
     * * `is_si` - true for SI units, false for IP
     * @param {number} t_dry_bulb
     * @param {number} relative_humidity
     * @param {number} pressure
     * @param {boolean} is_si
     * @returns {WasmMoistAir}
     */
    static fromRelativeHumidity(t_dry_bulb, relative_humidity, pressure, is_si) {
        const ret = wasm.wasmmoistair_fromRelativeHumidity(t_dry_bulb, relative_humidity, pressure, is_si);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmMoistAir.__wrap(ret[0]);
    }
    /**
     * Creates a new WasmMoistAir instance from dry-bulb temperature and humidity ratio.
     *
     * Arguments:
     * * `t_dry_bulb` - Dry-bulb temperature (°C or °F)
     * * `humidity_ratio` - Humidity Ratio (kg/kg for SI, lb/lb for IP)
     * * `pressure` - Atmospheric pressure (Pa for SI, Psi for IP)
     * * `is_si` - true for SI units, false for IP
     * @param {number} t_dry_bulb
     * @param {number} humidity_ratio
     * @param {number} pressure
     * @param {boolean} is_si
     * @returns {WasmMoistAir}
     */
    static fromHumidityRatio(t_dry_bulb, humidity_ratio, pressure, is_si) {
        const ret = wasm.wasmmoistair_fromHumidityRatio(t_dry_bulb, humidity_ratio, pressure, is_si);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmMoistAir.__wrap(ret[0]);
    }
    /**
     * Creates a new WasmMoistAir instance from dry-bulb temperature and specific enthalpy.
     * @param {number} t_dry_bulb
     * @param {number} specific_enthalpy
     * @param {number} pressure
     * @param {boolean} is_si
     * @returns {WasmMoistAir}
     */
    static fromSpecificEnthalpy(t_dry_bulb, specific_enthalpy, pressure, is_si) {
        const ret = wasm.wasmmoistair_fromSpecificEnthalpy(t_dry_bulb, specific_enthalpy, pressure, is_si);
        return WasmMoistAir.__wrap(ret);
    }
    /**
     * Returns the current wet-bulb temperature.
     * @param {number} t_dry_bulb
     * @param {number} t_wet_bulb
     * @param {number} pressure
     * @param {boolean} is_si
     * @returns {WasmMoistAir}
     */
    static fromTWetBulb(t_dry_bulb, t_wet_bulb, pressure, is_si) {
        const ret = wasm.wasmmoistair_fromTWetBulb(t_dry_bulb, t_wet_bulb, pressure, is_si);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmMoistAir.__wrap(ret[0]);
    }
    /**
     * Returns the current dew-point temperature.
     * @param {number} t_dry_bulb
     * @param {number} t_dew_point
     * @param {number} pressure
     * @param {boolean} is_si
     * @returns {WasmMoistAir}
     */
    static fromTDewPoint(t_dry_bulb, t_dew_point, pressure, is_si) {
        const ret = wasm.wasmmoistair_fromTDewPoint(t_dry_bulb, t_dew_point, pressure, is_si);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmMoistAir.__wrap(ret[0]);
    }
    /**
     * Returns the current dry-bulb temperature.
     * @returns {number}
     */
    tDryBulb() {
        const ret = wasm.wasmmoistair_tDryBulb(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the current humidity ratio.
     * @returns {number}
     */
    humidityRatio() {
        const ret = wasm.wasmmoistair_humidityRatio(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the specific enthalpy.
     * @returns {number}
     */
    specificEnthalpy() {
        const ret = wasm.wasmmoistair_specificEnthalpy(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the relative humidity.
     * @returns {number}
     */
    relativeHumidity() {
        const ret = wasm.wasmmoistair_relativeHumidity(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * Returns the wet-bulb temperature.
     * @returns {number}
     */
    tWetBulb() {
        const ret = wasm.wasmmoistair_tWetBulb(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * Returns the dew-point temperature.
     * @returns {number}
     */
    tDewPoint() {
        const ret = wasm.wasmmoistair_tDewPoint(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * Returns the moist air density.
     * @returns {number}
     */
    density() {
        const ret = wasm.wasmmoistair_density(this.__wbg_ptr);
        return ret;
    }
    /**
     * Heating process
     * @param {number} mda
     * @param {number} power
     */
    heatingPower(mda, power) {
        wasm.wasmmoistair_heatingPower(this.__wbg_ptr, mda, power);
    }
    /**
     * Heating process
     * @param {number} mda
     * @param {number} dt
     * @returns {number}
     */
    heatingDeltaTemperature(mda, dt) {
        const ret = wasm.wasmmoistair_heatingDeltaTemperature(this.__wbg_ptr, mda, dt);
        return ret;
    }
    /**
     * Cooling process
     * @param {number} mda
     * @param {number} power
     */
    coolingPower(mda, power) {
        const ret = wasm.wasmmoistair_coolingPower(this.__wbg_ptr, mda, power);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Cooling process
     * @param {number} mda
     * @param {number} dt
     * @returns {number}
     */
    coolingDeltaTemperature(mda, dt) {
        const ret = wasm.wasmmoistair_coolingDeltaTemperature(this.__wbg_ptr, mda, dt);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * Humidification process
     * @param {number} mda
     * @param {number} w
     */
    humidifyAdiabatic(mda, w) {
        const ret = wasm.wasmmoistair_humidifyAdiabatic(this.__wbg_ptr, mda, w);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Humidification process
     * @param {number} mda
     * @param {number} w
     */
    humidifyIsothermal(mda, w) {
        const ret = wasm.wasmmoistair_humidifyIsothermal(this.__wbg_ptr, mda, w);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}

const WasmPointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmpoint_free(ptr >>> 0, 1));

export class WasmPoint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmPoint.prototype);
        obj.__wbg_ptr = ptr;
        WasmPointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmPointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmpoint_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get x() {
        const ret = wasm.__wbg_get_wasmpoint_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set x(arg0) {
        wasm.__wbg_set_wasmpoint_x(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get y() {
        const ret = wasm.__wbg_get_wasmpoint_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set y(arg0) {
        wasm.__wbg_set_wasmpoint_y(this.__wbg_ptr, arg0);
    }
}

export function __wbg_wasmpoint_new(arg0) {
    const ret = WasmPoint.__wrap(arg0);
    return ret;
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_0;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

