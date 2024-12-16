// const xspecSettingsState = []
// const newXspecObject = {
//   topic: 'xspec1',
//   status: 'idle',
//   basicInfo: {
//     "Live Time": "",
//     "Start Time": "",
//     "Elapsed Time": "",
//     "Dead Time": "",
//     "Serial Number": "",
//     "Version": "",
//     "DOM": "Date of measurement",
//     "EOM": "End of measurement"
//   },
//   modeSettings: {
//     "Acquisition mode": "PHA || MCS",
//     "PHA": {
//       "Preset time": "60.0",
//       "MCA": {
//         "Channels": "1024",
//         "LLD": "6",
//         "ULD": "4095"
//       },
//       "Amplifier": {
//         "Coarse gain": "x1",
//         "Fine gain": "10",
//         "Digital gain": "x32",
//         "Input polarity": "Positive || Negative"
//       },
//       "Filter": {
//         "Threshold": "10",
//         "Rise time": "3.20 μs",
//         "Flat top": "1.00 μs",
//         "Poles/zeros": "1.80 μs",
//         "Digital BLR": "true || false",
//         "Pile-up reject": "true || false"
//       },
//       "High Voltage": {
//         "Volts": "650.0",
//         "ON": "true || false"
//       }
//     },
//     "MCS": {
//       "Dwell time": "60.0",
//       "MCS": {
//         "Channels": "1024",
//         "LLD": "6",
//         "ULD": "4095"
//       },
//       "Amplifier": {
//         "Coarse gain": "x1",
//         "Fine gain": "10",
//         "Digital gain": "x32",
//         "Input polarity": "Positive || Negative"
//       },
//       "Filter": {
//         "Threshold": "10",
//         "Rise time": "3.20 μs",
//         "Flat top": "1.00 μs",
//         "Poles/zeros": "1.80 μs",
//         "Digital BLR": "true || false",
//         "Pile-up reject": "true || false"
//       },
//       "High Voltage": {
//         "Volts": "650.0",
//         "ON": "true || false"
//       }
//     }
//   }
// };
// export const xspecSettings = (state = xspecSettingsState, action) => {
//   switch (action.type) {
//     case ADD_XSPEC_OBJECT:
//       return [...state, {...newXspecObject, topic: action.payload}];
      
//     default:
//       return state;
//   }
// }