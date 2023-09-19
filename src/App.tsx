import { useState } from "react";
import Select, { SelectedOption } from "./Select";

const options = [
  {
    label: "First",
    value: 1,
  },
  {
    label: "Second",
    value: 2,
  },
  {
    label: "Third",
    value: 3,
  },
  {
    label: "Fourth",
    value: 4,
  },
];
const App = () => {
  const [value, setValue] = useState<SelectedOption[]>(
    [options[0]]
  );
  return (
    <Select multiple={true} options={options} value={value} onChange={(o) => setValue(o)} />
  );
};

export default App;
