import { combineReducers } from '@reduxjs/toolkit';
import { peakReducer } from './peaksSlice';
import { settingsReducer } from './settingsSlice';
import { roiReducer } from './roiSlice';
import { nuclideLibReducer } from './nuclideSlice';


const customRootReducer = {
  // batch: batchReducer,
  // current_program: programReducer,
  // current_tab: tabReducer,
  // protocols:protocolsReducer,
  // checklistItems: checklistItems,
//   realTime:realTimeReducer,
//   cmds:stepUpdateReducer,
//   calibration:calibrationReducer,
//   data:sendDataToState,
//   agm: AgmReducer,
//   deviceInfo:updateDeviceInfo,
//   prgDetails:updatePrgDetails,
  roi:roiReducer,
//   upload:uploadReducer,
//   agmControls: agmControlsReducer,
//   about:aboutReducer,
//   xspecSettings:    ,
  nuclideLibrary: nuclideLibReducer,
//   DeviceStatus:telemetryReducer,
  settings:settingsReducer,
  peaks:peakReducer,
};

export default customRootReducer;