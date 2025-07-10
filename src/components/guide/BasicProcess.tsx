import { Helmet } from 'react-helmet-async';

const BasicProcess = () => {
    return (
        <>
            <Helmet>
                <title>Basic Process - Psychrometric Chart Calculator Guide</title>
                <meta name="description" content="Learn how to solve heating and cooling processes using the Psychrometric Chart Calculator. Step-by-step examples for sensible heating and cooling with dehumidification." />
                <link rel="canonical" href="https://psychroid.com/guide/basics/" />
            </Helmet>

            <h1 className="text-3xl font-bold mb-6">Quick Start Guide</h1>

            <p className="mb-6">
                Follow these simple steps to solve your first psychrometric problems.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Sensible Heating of Moist Air</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="mb-4">
                            <strong>Scenario</strong>: Moist air, saturated at 2°C, enters a heating coil at a rate of
                            10 m³/s. Air leaves the coil at 40°C. Find the required rate of heat
                            addition.
                        </p>

                        <p className="mb-4">
                            In sensible heating, the air temperature increases while the humidity ratio remains constant.
                            This process moves horizontally from left to right on the psychrometric chart.
                        </p>

                        <ol className="list-decimal pl-10 mb-4 space-y-2">
                            <li>Set Initial State:</li>
                            <ul className="list-disc pl-10 space-y-1">
                                <li>Pressure [Pa]: 101325.0</li>
                                <li>Dry-bulb Temperature [°C]: 2</li>
                                <li>Relative Humidity [%]: 100.0</li>
                                <li>Volumetric Flow Rate [m³/h]: 36000.0</li>
                                <li>Press "Set Initial State" Button</li>
                            </ul>
                            <li>Set Process 0→1:</li>
                            <ul className="list-disc pl-10 space-y-1">
                                <li>Process Type: Heating</li>
                                <li>Input Type: ΔT</li>
                                <li>ΔT [°C]: 38</li>
                                <li>Press "Apply Process" Button</li>
                            </ul>
                            <li>The required heating capacity is presented in the results table</li>
                        </ol>

                        <p className="mb-2">
                            <strong>Solution:</strong> The required heating capacity is approximately 491 kW.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4 shadow-sm bg-white">
                        <h3 className="text-lg font-medium mb-3">Psychrometric Process Visualization</h3>
                        <img
                            src="/chart_heating.svg"
                            alt="Sensible heating process on psychrometric chart"
                            className="w-full h-auto"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                            Point 0: Initial air state (2°C, 100% RH)<br />
                            Point 1: Final air state (40°C, 9.6% RH)<br />
                            The horizontal line represents constant humidity ratio during heating.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Cooling and Dehumidification of Moist Air</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="mb-4">
                            <strong>Scenario</strong>: Moist air at 30°C dry-bulb temperature and 50% rh enters a
                            cooling coil at 5 m³/s and is processed to a final saturation condition at
                            10°C. Find the kW of refrigeration required.
                        </p>

                        <p className="mb-4">
                            In this process, the air is cooled below its dew point temperature, causing moisture to condense out.
                            The resulting air has both a lower temperature and lower humidity ratio.
                        </p>

                        <ol className="list-decimal pl-10 mb-4 space-y-2">
                            <li>Set Initial State:</li>
                            <ul className="list-disc pl-10 space-y-1">
                                <li>Pressure [Pa]: 101325.0</li>
                                <li>Dry-bulb Temperature [°C]: 30</li>
                                <li>Relative Humidity [%]: 50.0</li>
                                <li>Volumetric Flow Rate [m³/h]: 18000.0</li>
                                <li>Press "Set Initial State" Button</li>
                            </ul>
                            <li>Set Process 0→1:</li>
                            <ul className="list-disc pl-10 space-y-1">
                                <li>Process Type: Cooling</li>
                                <li>Input Type: ΔT</li>
                                <li>ΔT [°C]: 20</li>
                                <li>Press "Apply Process" Button</li>
                            </ul>
                            <li>The required cooling capacity is presented in the results table</li>
                        </ol>

                        <p className="mb-2">
                            <strong>Solution:</strong> The refrigeration required is approximately 199 kW.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4 shadow-sm bg-white">
                        <h3 className="text-lg font-medium mb-3">Psychrometric Process Visualization</h3>
                        <img
                            src="/chart_cooling.svg"
                            alt="Cooling and dehumidification process on psychrometric chart"
                            className="w-full h-auto"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                            Point 0: Initial air state (30°C, 50% RH)<br />
                            Point 1: Final air state (10°C, 100% RH)<br />
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Adiabatic Mixing of Two Moist Airstreams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="mb-4">
                            <strong>Scenario</strong>: A stream of 2 m³/s of outdoor air at 4°C dry-bulb temperature
                            and 2°C thermodynamic wet-bulb temperature is adiabatically mixed
                            with 6.25 m³/s of recirculated air at 25°C dry-bulb temperature and
                            50% rh. Find the dry-bulb temperature and thermodynamic wet-bulb
                            temperature of the resulting mixture.
                        </p>

                        <p className="mb-4">
                            In this process, two airstreams with different properties are mixed, resulting in a new air state with intermediate properties.
                            The final state is determined by an energy and mass balance between the two streams, with the mixing point lying on a straight line connecting the two initial states on the psychrometric chart.
                            The position of the mixing point on this line depends on the mass flow rates of the two streams.
                        </p>

                        <ol className="list-decimal pl-10 mb-4 space-y-2">
                            <li>Set Initial State:</li>
                            <ul className="list-disc pl-10 space-y-1">
                                <li>Pressure [Pa]: 101325.0</li>
                                <li>Dry-bulb Temperature [°C]: 4.0</li>
                                <li>Wet-bulb Temperature [°C]: 2.0</li>
                                <li>Volumetric Flow Rate [m³/h]: 7200</li>
                                <li>Press "Set Initial State" Button</li>
                            </ul>
                            <li>Set Process 0→1:</li>
                            <ul className="list-disc pl-10 space-y-1">
                                <li>Process Type: Mixing</li>
                                <li>Dry-bulb Temperature [°C]: 25.0</li>
                                <li>Volumetric Flow Rate [m³/h]: 22500</li>
                                <li>Relative Humidity [%]: 50.0</li>
                                <li>Press "Apply Process" Button</li>
                            </ul>
                            <li>The resulting dry-bulb temperature and wet-bulb temperature of the mixed air are presented in the state table.</li>
                        </ol>

                        <p className="mb-2">
                            <strong>Solution:</strong> The dry-bulb temperature is approximately 19.6 °C, and the wet-bulb temperature is approximately 14.6 °C.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4 shadow-sm bg-white">
                        <h3 className="text-lg font-medium mb-3">Psychrometric Process Visualization</h3>
                        <img
                            src="/chart_mixing.svg"
                            alt="Mixing process on psychrometric chart"
                            className="w-full h-auto"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                            Point 0: Initial air state (4.0°C, 70.7% RH)<br />
                            Point 1: Final air state (19.6°C, 58.0% RH)<br />
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BasicProcess;