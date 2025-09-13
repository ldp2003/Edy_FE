import React from "react";
import { Collapse } from "antd";
import SchoolSelection from "../../../components/accountActivation/SchoolSelection";
import SearchScopeInput from "../../../components/accountActivation/SearchScopeInput";

const AccountActivation: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Activate your account</h1>
      <p className="text-gray-600 mb-6">
        Tell us about yourself so we can recommend you study material, new
        features, and much more!
      </p>
      <Collapse defaultActiveKey={["1"]}>
        <Collapse.Panel header="Where do you study?" key="1">
          <SchoolSelection />
        </Collapse.Panel>
        <Collapse.Panel header="Enter your search scope" key="2">
          <SearchScopeInput />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default AccountActivation;
