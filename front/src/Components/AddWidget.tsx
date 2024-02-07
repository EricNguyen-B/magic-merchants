import "./AddWidget.css";
import { useState } from "react";
import { getAxiosErrorMessages } from "./utils";

function AddWidget() {
    let [messages, setMessages] = useState<string[]>([]);
    let [make, setMake] = useState("");
    let [manufactureDate, setManufactureDate] = useState("");

    let handleSubmit = async function () {
        try {
            // TODO
            setMessages(["Widget successfully added"]);
        } catch (error) {
            setMessages(getAxiosErrorMessages(error));
        }
    };

    return (
        <>
            <h2>Add a widget</h2>
            <div id="widget-form">
                <label>
                    Make:
                    <select
                        value={make}
                        onChange={(e) => {
                            setMake(e.target.value);
                        }}
                    >
                        <option value="">Select a make</option>
                        <option value="foo">Foo</option>
                        <option value="bar">Bar</option>
                        <option value="baaz">Baaz</option>
                        <option value="quux">Quux</option>
                    </select>
                </label>
                <label>
                    Manufacture date (YYYY-MM-DD):
                    <input
                        type="text"
                        name="manufacture_date"
                        value={manufactureDate}
                        onChange={(e) => {
                            setManufactureDate(e.target.value);
                        }}
                    ></input>
                </label>
                <button onClick={handleSubmit}>Add Widget</button>
                <div className="error-message">
                    {messages.map((message, i) => (
                        <div key={i}>{message}</div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AddWidget;
