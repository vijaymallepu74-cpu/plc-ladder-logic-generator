function generateLogic(){

const prompt =
document.getElementById("prompt").value;

let logic = `
INPUT REQUIREMENT:
${prompt}

--------------------------------

GENERATED LADDER LOGIC:

Rung 1:
Start PB ----] [---- Stop PB ----]/[---- Motor Coil (M1)

Rung 2:
Motor Coil (M1) ----] [---- TON Timer T4:0

Rung 3:
T4:0/DN ----] [---- Output Lamp

--------------------------------

PLC TAGS:

Start_PB
Stop_PB
Motor_M1
Timer_T4_0
Output_Lamp

--------------------------------

DESCRIPTION:

Motor starts using Start Push Button.
Stop Push Button stops motor.
After timer completion, output lamp energizes.
`;

document.getElementById("output").innerText = logic;

}
