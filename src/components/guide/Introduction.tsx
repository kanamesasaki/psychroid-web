import { Helmet } from 'react-helmet-async';

const Introduction = () => {
    return (
        <>
            <Helmet>
                <title>Introduction - Psychrometric Chart Calculator Guide</title>
                <meta name="description" content="Learn about the basics of psychrometric charts and how to use our calculator tool." />
            </Helmet>

            <h1 className="text-3xl font-bold mb-6">Making Psychrometrics Simple</h1>

            <section className="mb-8">
                <p className="mb-4">
                    Psychrometrics is the study of air-water mixtures and their properties. Understanding these relationships
                    is crucial for designing efficient HVAC systems, controlling indoor comfort, and solving various
                    engineering challenges related to humidity and temperature control.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">What You'll Discover</h2>
                <p className="mb-4">
                    This tool isn't just another calculator—it's your visual playground for exploring how air behaves
                    under different conditions. Whether you're designing HVAC systems, studying building science,
                    or just learning about psychrometrics, our interactive chart helps you visualize and understand
                    complex air property relationships.
                </p>
                <ul className="list-disc pl-10 mb-4 space-y-2">
                    <li>Evaluate air state and specify the following parameters:</li>
                    <ul className="list-disc pl-10 mt-2 space-y-1">
                        <li>Dry Bulb Temperature, <span className="font-medium">T<sub>db</sub></span></li>
                        <li>Wet Bulb Temperature, <span className="font-medium">T<sub>wb</sub></span></li>
                        <li>Dew Point Temperature, <span className="font-medium">T<sub>dew</sub></span></li>
                        <li>Humidity Ratio, <span className="font-medium">W</span></li>
                        <li>Relative Humidity, <span className="font-medium">RH</span></li>
                        <li>Specific Enthalpy, <span className="font-medium">h</span></li>
                        <li>Density, <span className="font-medium">ρ</span></li>
                        <li>Dry Air Mass Flow Rate, <span className="font-medium">ṁ<sub>da</sub></span></li>
                        <li>Volumetric Flow Rate, <span className="font-medium">V̇</span></li>
                    </ul>
                    <li>Multi-step air process calculation including Heating, Cooling, and Humidification</li>
                    <li>Air state and process visualization on the psychrometric chart</li>
                    <li>Support for both SI (metric) and IP (imperial) unit systems</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Implementation Standards</h2>
                <p className="mb-4">
                    The psychrometric calculations in this tool follow the standards established by ASHRAE
                    <a href="#ref-ashrae2017si" className="text-blue-600 hover:underline ml-1">[1]</a>, <a href="#ref-ashrae2017ip" className="text-blue-600 hover:underline ml-1">[2]</a>.
                    The calculation library is open source and available on GitHub: <a href="https://github.com/kanamesasaki/psychroid" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://github.com/kanamesasaki/psychroid</a>.
                    Contributions are welcome! Please open an issue or submit a pull request if you have suggestions for improvements, bug fixes, or additional features.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">References</h2>

                <div className="pl-5 space-y-4 text-sm">
                    <div className="flex" id="ref-ashrae2017si">
                        <div className="flex-none w-10 text-right mr-2">[1]</div>
                        <div>
                            <span className="font-medium">ASHRAE</span> (2017).
                            "<span className="italic">ASHRAE Handbook—Fundamentals (SI Edition)</span>".
                            American Society of Heating, Refrigerating and Air-Conditioning Engineers.
                        </div>
                    </div>
                    <div className="flex" id="ref-ashrae2017ip">
                        <div className="flex-none w-10 text-right mr-2">[2]</div>
                        <div>
                            <span className="font-medium">ASHRAE</span> (2017).
                            "<span className="italic">ASHRAE Handbook—Fundamentals (IP Edition)</span>".
                            American Society of Heating, Refrigerating and Air-Conditioning Engineers.
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Introduction;