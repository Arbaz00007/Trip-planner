import { Box } from "@mui/material";
import Header from "../../components/admin/Header";
import Packageform from "./PackageForm";

const AddGuider = () => {
  return (
    <Box m="20px">
      <Box height="75vh">
        <Header title="Add Package" subtitle="Here you can add Package" />
        <Packageform/>
      </Box>
    </Box>
  );
};

export default AddGuider;