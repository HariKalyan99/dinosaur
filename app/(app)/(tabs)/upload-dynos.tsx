import CustomHeader from "@/app/common/custom-header";
import CustomSafeAreaView from "@/app/common/custom-safearea-view";
import CustomView from "@/app/common/custom-view";
import UploadDynoButton from "@/app/components/uploadDyno/upload-dyno-button";
import React from "react";

const UploadDynos = () => {
  return (
    <CustomView>
      <CustomSafeAreaView>
        <CustomHeader title="Upload Dyno" />
        <UploadDynoButton />
      </CustomSafeAreaView>
    </CustomView>
  );
};

export default UploadDynos;
