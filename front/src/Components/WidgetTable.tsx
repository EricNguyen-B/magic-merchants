import { useState, useEffect } from "react";
import axios from "axios";
import "./WidgetTable.css";
import { getAxiosErrorMessages, Widget } from "./utils";

function WidgetTable() {
    let [messages, setMessages] = useState<string[]>([]);
    let [widgets, setWidgets] = useState<Widget[]>([]);
    let [colorFilter, setColorFilter] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                let {
                    data: { widgets },
                } = await axios.get<{ widgets: Widget[] }>("/api/widgets");
                setWidgets(widgets);
                setMessages([]);
            } catch (error) {
                setMessages(getAxiosErrorMessages(error));
            }
        })();
    }, []);

    return (
        <>
            <h2>See all widgets</h2>
            <div id="widget-table">
                <label>
                    Filter by color:
                    <select
                        value={colorFilter}
                        onChange={(e) => setColorFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                    </select>
                </label>
                <table>
                    <thead>
                        <tr>
                            <th>Make</th>
                            <th>Color</th>
                            <th>Manufacture Date</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {widgets
                            .filter(
                                ({ color }) =>
                                    colorFilter === "" || color === colorFilter
                            )
                            .map(
                                ({
                                    id,
                                    make,
                                    color,
                                    manufacture_date,
                                    notes,
                                }) => (
                                    <tr key={id}>
                                        <td key={`${id}-make`}>{make}</td>
                                        <td key={`${id}-color`}>{color}</td>
                                        <td key={`${id}-manufacture_date`}>
                                            {manufacture_date}
                                        </td>
                                        <td key={`${id}-notes`}>{notes}</td>
                                    </tr>
                                )
                            )}
                    </tbody>
                </table>
                <div>
                    {messages.map((message, i) => (
                        <div key={i}>{message}</div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default WidgetTable;
