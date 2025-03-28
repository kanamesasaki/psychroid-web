import { Helmet } from 'react-helmet-async';

const BasicProcess = () => {
    return (
        <>
            <Helmet>
                <title>Basic HVAC Process - Psychrometric Chart Calculator Guide</title>
                <meta name="description" content="Learn how to set up and use the Psychrometric Chart Calculator for common HVAC applications." />
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
        </>
    );
};

export default BasicProcess;