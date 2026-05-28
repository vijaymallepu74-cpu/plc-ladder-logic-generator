function generateLogic(){

  const plc =
  document.getElementById("plcModel").value;

  const prompt =
  document.getElementById("prompt").value.toLowerCase();

  const svg =
  document.getElementById("ladderSVG");

  // RESET SVG
  svg.innerHTML = `

    <line x1="50" y1="20" x2="50" y2="950" class="rail"/>
    <line x1="1450" y1="20" x2="1450" y2="950" class="rail"/>

  `;

  let logicTitle = "";
  let ioTable = "";
  let alarmTable = "";
  let sequence = "";

  // =========================
  // EMERGENCY STOP
  // =========================

  if(prompt.includes("emergency")){

    logicTitle = "Emergency Shutdown Logic";

    drawEmergencyRung(120);

    ioTable = `

      <tr>
        <td>I:0/0</td>
        <td>E_STOP_PB</td>
        <td>Emergency Stop Push Button</td>
      </tr>

      <tr>
        <td>O:0/0</td>
        <td>MAIN_MOTOR</td>
        <td>Main Conveyor Motor</td>
      </tr>

    `;

    alarmTable = `

      <tr>
        <td>ALM_001</td>
        <td>Emergency Stop Activated</td>
      </tr>

    `;

    sequence = `

      <li>System runs under normal condition.</li>
      <li>E-Stop pushbutton pressed.</li>
      <li>Main motor output de-energizes.</li>
      <li>Alarm generated in HMI/DCS.</li>

    `;
  }

  // =========================
  // PUMP LOGIC
  // =========================

  else if(prompt.includes("pump")){

    logicTitle = "Lead Lag Pump Logic";

    drawPumpLogic(120);

    ioTable = `

      <tr>
        <td>I:0/0</td>
        <td>PUMP1_START</td>
        <td>Pump 1 Start Push Button</td>
      </tr>

      <tr>
        <td>I:0/1</td>
        <td>PUMP2_START</td>
        <td>Pump 2 Start Push Button</td>
      </tr>

      <tr>
        <td>I:0/2</td>
        <td>LOW_LEVEL</td>
        <td>Low Level Switch</td>
      </tr>

      <tr>
        <td>O:0/0</td>
        <td>PUMP1_MOTOR</td>
        <td>Pump 1 Motor</td>
      </tr>

      <tr>
        <td>O:0/1</td>
        <td>PUMP2_MOTOR</td>
        <td>Pump 2 Motor</td>
      </tr>

    `;

    alarmTable = `

      <tr>
        <td>ALM_002</td>
        <td>Low Tank Level</td>
      </tr>

      <tr>
        <td>ALM_003</td>
        <td>Pump Overload Trip</td>
      </tr>

    `;

    sequence = `

      <li>Pump 1 acts as Lead Pump.</li>
      <li>Pump 2 acts as Lag Pump.</li>
      <li>Lag pump starts during high demand.</li>
      <li>System trips on low level.</li>

    `;
  }

  // =========================
  // CONVEYOR LOGIC
  // =========================

  else if(prompt.includes("conveyor")){

    logicTitle = "Conveyor Sequential Logic";

    drawConveyorLogic(120);

    ioTable = `

      <tr>
        <td>I:0/0</td>
        <td>START_PB</td>
        <td>Conveyor Start Push Button</td>
      </tr>

      <tr>
        <td>I:0/1</td>
        <td>OL_TRIP</td>
        <td>Overload Trip Input</td>
      </tr>

      <tr>
        <td>O:0/0</td>
        <td>CONV_MOTOR</td>
        <td>Conveyor Motor Output</td>
      </tr>

    `;

    alarmTable = `

      <tr>
        <td>ALM_004</td>
        <td>Conveyor Overload</td>
      </tr>

    `;

    sequence = `

      <li>Operator presses start PB.</li>
      <li>Conveyor motor energizes.</li>
      <li>Motor trips during overload.</li>

    `;
  }

  // =========================
  // PID LOGIC
  // =========================

  else if(prompt.includes("pid")){

    logicTitle = "PID Control Logic";

    drawPIDLogic(120);

    ioTable = `

      <tr>
        <td>AI:0</td>
        <td>PV_TEMP</td>
        <td>Process Temperature Input</td>
      </tr>

      <tr>
        <td>AO:0</td>
        <td>CV_OUTPUT</td>
        <td>Control Valve Output</td>
      </tr>

    `;

    alarmTable = `

      <tr>
        <td>ALM_005</td>
        <td>High Temperature Alarm</td>
      </tr>

    `;

    sequence = `

      <li>PID compares SP and PV.</li>
      <li>Control output adjusted automatically.</li>
      <li>Alarm generated on high temperature.</li>

    `;
  }

  // =========================
  // DEFAULT
  // =========================

  else{

    logicTitle = "Motor Start Stop Logic";

    drawMotorLogic(120);

    ioTable = `

      <tr>
        <td>I:0/0</td>
        <td>START_PB</td>
        <td>Start Push Button</td>
      </tr>

      <tr>
        <td>I:0/1</td>
        <td>STOP_PB</td>
        <td>Stop Push Button</td>
      </tr>

      <tr>
        <td>O:0/0</td>
        <td>MOTOR_RUN</td>
        <td>Main Motor Output</td>
      </tr>

    `;

    alarmTable = `

      <tr>
        <td>ALM_006</td>
        <td>Motor Overload</td>
      </tr>

    `;

    sequence = `

      <li>Press Start PB.</li>
      <li>Motor energizes.</li>
      <li>Stop PB de-energizes motor.</li>

    `;
  }

  // OUTPUT SECTION
  document.getElementById("outputSection").innerHTML = `

    <h2 class="section-title">Logic Details</h2>

    <table>

      <tr>
        <th>PLC Model</th>
        <th>Generated Logic</th>
      </tr>

      <tr>
        <td>${plc}</td>
        <td>${logicTitle}</td>
      </tr>

    </table>

    <table>

      <tr>
        <th>Address</th>
        <th>Tag</th>
        <th>Description</th>
      </tr>

      ${ioTable}

    </table>

    <table>

      <tr>
        <th>Alarm ID</th>
        <th>Description</th>
      </tr>

      ${alarmTable}

    </table>

    <h2 class="section-title">Sequence Of Operation</h2>

    <ol>

      ${sequence}

    </ol>

  `;
}

// =========================
// MOTOR LOGIC
// =========================

function drawMotorLogic(y){

  const svg =
  document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1450" y2="${y}" class="rung"/>

    <line x1="180" y1="${y-20}" x2="180" y2="${y+20}" class="contact"/>
    <line x1="210" y1="${y-20}" x2="210" y2="${y+20}" class="contact"/>

    <text x="150" y="${y+45}" class="label">START</text>

    <line x1="340" y1="${y-20}" x2="340" y2="${y+20}" class="contact"/>
    <line x1="370" y1="${y-20}" x2="370" y2="${y+20}" class="contact"/>

    <line x1="335" y1="${y+20}" x2="375" y2="${y-20}" class="contact"/>

    <text x="320" y="${y+45}" class="label">STOP</text>

    <path d="
      M 1000 ${y-20}
      Q 970 ${y} 1000 ${y+20}

      M 1040 ${y-20}
      Q 1070 ${y} 1040 ${y+20}
    " class="coil"/>

    <text x="960" y="${y+45}" class="label">MOTOR</text>

  `;
}

// =========================
// EMERGENCY
// =========================

function drawEmergencyRung(y){

  const svg =
  document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1450" y2="${y}" class="rung"/>

    <line x1="280" y1="${y-20}" x2="280" y2="${y+20}" class="contact"/>
    <line x1="310" y1="${y-20}" x2="310" y2="${y+20}" class="contact"/>

    <line x1="275" y1="${y+20}" x2="315" y2="${y-20}" class="contact"/>

    <text x="220" y="${y+45}" class="label">E-STOP</text>

    <path d="
      M 1000 ${y-20}
      Q 970 ${y} 1000 ${y+20}

      M 1040 ${y-20}
      Q 1070 ${y} 1040 ${y+20}
    " class="coil"/>

    <text x="940" y="${y+45}" class="label">MOTOR OFF</text>

  `;
}

// =========================
// PUMP LOGIC
// =========================

function drawPumpLogic(y){

  const svg =
  document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1450" y2="${y}" class="rung"/>

    <line x1="180" y1="${y-20}" x2="180" y2="${y+20}" class="contact"/>
    <line x1="210" y1="${y-20}" x2="210" y2="${y+20}" class="contact"/>

    <text x="120" y="${y+45}" class="label">LEAD PUMP</text>

    <line x1="420" y1="${y-20}" x2="420" y2="${y+20}" class="contact"/>
    <line x1="450" y1="${y-20}" x2="450" y2="${y+20}" class="contact"/>

    <text x="360" y="${y+45}" class="label">LEVEL OK</text>

    <path d="
      M 1000 ${y-20}
      Q 970 ${y} 1000 ${y+20}

      M 1040 ${y-20}
      Q 1070 ${y} 1040 ${y+20}
    " class="coil"/>

    <text x="950" y="${y+45}" class="label">PUMP</text>

  `;
}

// =========================
// CONVEYOR LOGIC
// =========================

function drawConveyorLogic(y){

  const svg =
  document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1450" y2="${y}" class="rung"/>

    <line x1="200" y1="${y-20}" x2="200" y2="${y+20}" class="contact"/>
    <line x1="230" y1="${y-20}" x2="230" y2="${y+20}" class="contact"/>

    <text x="160" y="${y+45}" class="label">START PB</text>

    <path d="
      M 1000 ${y-20}
      Q 970 ${y} 1000 ${y+20}

      M 1040 ${y-20}
      Q 1070 ${y} 1040 ${y+20}
    " class="coil"/>

    <text x="920" y="${y+45}" class="label">CONVEYOR</text>

  `;
}

// =========================
// PID LOGIC
// =========================

function drawPIDLogic(y){

  const svg =
  document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1450" y2="${y}" class="rung"/>

    <rect
      x="400"
      y="${y-30}"
      width="200"
      height="60"
      class="timer"/>

    <text x="470" y="${y+5}" class="label">
      PID LOOP
    </text>

    <path d="
      M 1000 ${y-20}
      Q 970 ${y} 1000 ${y+20}

      M 1040 ${y-20}
      Q 1070 ${y} 1040 ${y+20}
    " class="coil"/>

    <text x="920" y="${y+45}" class="label">
      CONTROL VALVE
    </text>

  `;
}

// =========================
// PDF
// =========================

async function downloadPDF(){

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  const plc =
  document.getElementById("plcModel").value;

  const prompt =
  document.getElementById("prompt").value;

  pdf.setFontSize(24);

  pdf.text(
    "AI Master Vijay",
    20,
    20
  );

  pdf.setFontSize(18);

  pdf.text(
    "Advanced PLC / DCS Logic Report",
    20,
    35
  );

  pdf.setFontSize(12);

  pdf.text(
    `PLC Model: ${plc}`,
    20,
    60
  );

  pdf.text(
    `Requirement: ${prompt}`,
    20,
    75
  );

  pdf.text(
    "Generated by AI Master Vijay",
    20,
    110
  );

  pdf.save(
    "Advanced_PLC_DCS_Report.pdf"
  );

}
