interface Timeline_Props{
    title:string,
    total_duration:number,
    steps:Program_Step_Prop[],
    last_run:Date,
    paused_state:boolean,
    current_run_time:number
}

interface Program_Step_Prop{
    name:string,
    description:string,
    duration:number,
    reagent_to:string,
    reagent_from:string,
    speed:number,
    quantity:number,
    current_run_time:number
}