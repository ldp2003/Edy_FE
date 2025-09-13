import React, { useState } from "react";
import {  AutoComplete, Button } from "antd";

const predefinedSchools = [
  "Harvard University",
  "Stanford University",
  "Massachusetts Institute of Technology",
  "University of Oxford",
  "University of Cambridge",
];

const SchoolSelection: React.FC = () => {
  const [school, setSchool] = useState("");

  const handleSelect = (value: string) => {
    setSchool(value);
  };

  return (
    <div>
      <label className="block text-gray-700 mb-2">I study at</label>
      <AutoComplete
        options={predefinedSchools.map((school) => ({ value: school }))}
        style={{ width: "100%" }}
        onSelect={handleSelect}
        onChange={(value) => setSchool(value)}
        placeholder="Type your university / school name"
      />
      <Button type="primary" className="mt-4 w-full">
        Save
      </Button>
    </div>
  );
};

export default SchoolSelection;
