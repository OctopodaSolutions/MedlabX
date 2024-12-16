// import { useSelector } from "react-redux";
// import { store } from "./store";
let config = null;

export async function fetchConfig() {
  if (config) return config; // Return cached config if already fetched
  try {
    const response = await fetch('/config');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    config = await response.json();
    return config;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error; // Re-throw error for handling in caller
  }
}

async function getServerAddr() {
  try {
    const data = await fetchConfig();
    return `${data.HTTP_SERVER_ADDR}:${data.HTTP_SERVER_PORT}`;
  } catch (error) {
    return 'http://localhost:3001';
  }
}

export const Server_Addr = await getServerAddr();
// export const Server_Addr = 'https://xtract10.com:443';
// export const Server_Addr = process.env.CONFIG ? process.env.CONFIG.API_URL : 'http://localhost:3001';



export const Prg_Template = {
    UID: '',
    name: 'Undefined',
    desc: 'Undefined',
    steps: [],
    title: 'Undefined',
    reagents: [],
    line_positions: [],
    samples: [],
    total_duration: -1,
    date_created: null,
    owner: '',
    last_run: null,
    nuclide: null,
    editCurrentPrg: false,
    line_id: ''
}

export const Line_Template = {
    line_id: '',
    active: false,
    connected: false,
    batch_id: '',
    prg: {},
    arduino_addr: '',
    start_time: '',
    end_time: '',
    reagents_positions: []
}

export const Connection_Settings = {
    HTTP_SERVER_ADDR: '',
    HTTP_SERVER_PORT: '',
    MQTT_SERVER_ADDR: '',
    MQTT_SERVER_PORT: '',
    MQTT_CLIENT_NAME: '',
    WEBSOCKET_SERVER_ADDR: '',
    WEBSOCKET_SERVER_PORT: '',
    NUMBER_OF_LINES: '',
    DEMO_MODE: false,
    SERVER_CONNECTED: false,
    NUM_MSGS: 1000,
    TELE_DELAY: 3000,
    MQTT_CONNECTED: false
}

export const Reagent_Details = {
    UID: '',
    line_id: '',
    title: '',
    abbr: '',
    expiry: '',
    res_qty: '',
    buf_qty: '',
    created_date: '',
    expiry_date: '',
    stock_pos: 0,
    buffer_pos: 0,
    line_pos: 0
};

export const Step_Template = {
    id: -1,
    title: '',
    pump_speed: -1,
    reagent_to: -1,
    reagent_from: -1,
    step_duration: -1
}

export const Reagent_Template = {
    name: '',
    expiry: '',
    shorthand: '',
    qty: '',
    uid: '',
    reagent_abbr: ''
}

export const First_Step = {
    id: 0,
    title: 'Initialize',
    pump_speed: 1000,
    duration: 0,
    to_pos: 1,
    from_pos: 1
}

export const ObjFrmArduino = {

    cmd: {
        type: "SendPrg",
        feed: {
            name: "hs1",
            returnFeed: "ss",
            active: false
        },
        prg_id: (" "),
        steps: []
    }
}

export const deleteFrmArduino = {

    cmd: {
        type: "DeletePrgStep",
        feed: {
            name: "readdata",
            returnFeed: "send",
            active: false
        },
        prg_id: (" ")
    }

}


export const scanQRCode = {
    cmd: {
        type: "ScanQRCode",
        feed: {
            name: "readdata",
            returnFeed: "send",
            active: false
        }
    }
}



export const Line_Position_Unit = [
    {
        pos_id: 0,
        reagent: {}
    },
    {
        pos_id: 1,
        reagent: {}
    },
    {
        pos_id: 2,
        reagent: {}
    },
    {
        pos_id: 3,
        reagent: {}
    },
    {
        pos_id: 4,
        reagent: {}
    },
    {
        pos_id: 5,
        reagent: {}
    }
]

export const Line_Positions_Reagents = {
    1: {
        pos_id: 1,
        reagent: {}
    },
    2: {
        pos_id: 2,
        reagent: {}
    },
    3: {
        pos_id: 3,
        reagent: {}
    },
    4: {
        pos_id: 4,
        reagent: {}
    },
    5: {
        pos_id: 5,
        reagent: {}
    },
    6: {
        pos_id: 6,
        reagent: {}
    }

}

export const Line_Positions_CollectionBeakers = [
    {
        pos_id: 1,
        name: "Collection Beaker 1",
        abbr: "CB 1"
    },
    {
        pos_id: 2,
        name: "Collection Beaker 2",
        abbr: "CB 2"
    },
    {
        pos_id: 3,
        name: "Collection Beaker 3",
        abbr: "CB 3"
    },
    {
        pos_id: 4,
        name: "Collection Beaker 4",
        abbr: "CB 4"
    },
    // {
    //     pos_id:5,
    //     name: "Collection Beaker 5",
    //     abbr: "CB 5"
    // },
    // {
    //     pos_id:6,
    //     name: "Collection Beaker 6",
    //     abbr: "CB 6"
    // }
]

export const BatchRun = {
    UID: '',
    title: '',
    last_run: '',
    owner_id: '',
    units: [
        {
            prg: {},
            prg_name: '',
            prg_id: '',
            line_positions: [],
            reagents: []
        }],

}

export const BatchRunUnit = {
    UID: '',
    prg: {},
    prg_name: '',
    prg_id: '',
    line_positions: [],
    reagents: [],
    date_created: '',
    owner_id: '',
    owner_name: '',
    active: false,
    line_id: 'Line'
}

export const ConnectionDetails =
{
    feeds: [
        {
            "name": "hs1",
            "returnFeed": "ss1",
            "active": false
        }

    ],
    cmd: ""
}

export const PrgObjToArduino = {
    cmd: {
        type: "PrgTestAPI",
        feed: {
            name: "hs1",
            returnFeed: "ss1",
            active: false
        },
        prg: {
            steps: []
        }
    }
}

export const CalibrationObj = {
    cal: {
        line_id: '',
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        deg: 0,
        dv1: 0,
        dv2: 0,
        dv3: 0,
        dv4: 0,
        dv5: 0,
        dv6: 0,
    }
};

export const PrgObjToSerial = {
    cmd: {
        type: "Command",
        msg: "",
        comID: "",
        baudrate: ""
    }
};

export const MqttConnectionObj = {
    feeds: [{
        name: '',
        returnFeed: '',
    }]
}

export const HistoryObj = {
    UID: '',
    title: '',
    run_date: null,
    run_owner: '',
    checklist_owner: '',
    line: '',
    prg: null,
    checklist: null,
    start_time: null,
    end_time: null,
    mode: 'start'
}