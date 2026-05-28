function generateLogic(){

  const plc =
  document.getElementById("plcModel").value;

  const prompt =
  document.getElementById("prompt").value.toLowerCase();

  const svg =
  document.getElementById("ladderSVG");

  // Reset SVG
  svg.innerHTML = `

    <line x1="50" y1="20" x2="50" y2="650" class="rail"/>
    <line x1="1150" y1="20" x2="1150" y2="650" class="rail"/>

  `;

  let logicType = "";
  let tags = "";
  let alarms = "";
  let sequence = "";

  // EMERGENCY STOP LOGIC
  if(prompt.includes("emergency")){

    logicType = "Emergency Shutdown Logic";

    drawEmergencyLogic(120);

    tags = `
      <tr>
        <td>I:0/0</td>
        <td>E_STOP</td>
        <td>Emergency Stop Push Button</td>
      </tr>

      <tr>
        <td>O:0/0</td>
        <td>MOTOR_RUN</td>
        <td>Main Conveyor Motor</td>
      </tr>
    `;

    alarms = `
      <tr>
        <td>ALM_001</td>
        <td>Emergency Stop Activated</td>
      </tr>
    `;

    sequence = `
      <li>System runs normally.</li>
      <li>Emergency stop pressed.</li>
      <li>Motor output de-energizes.</li>
      <li>Alarm generated.</li>
    `;
  }

  // PUMP LOGIC
  else if(prompt.includes("pump")){

    logicType = "Pump Interlock Logic";

    drawPumpLogic(120);

    tags = `
      <tr>
        <td>I:0/0</td>
        <td>PUMP_START</td>
        <td>Pump Start Push Button</td>
      </tr>

      <tr>
        <td>I:0/1</td>
        <td>LOW_LEVEL</td>
        <td>Tank Low Level Switch</td>
      </tr>

      <tr>
        <td>O:0/0</td>
        <td>PUMP_MOTOR</td>
        <td>Pump Motor Output</td>
      </tr>
    `;

    alarms = `
      <tr>
        <td>ALM_002</td>
        <td>Low Tank Level</td>
      </tr>
    `;

    sequence = `
      <li>Operator presses start.</li>
      <li>Pump runs if tank level healthy.</li>
      <li>Pump trips on low level.</li>
    `;
  }

  // CONVEYOR LOGIC
  else if(prompt.includes("conveyor")){

    logicType = "Conveyor Logic";

    drawConveyorLogic(120);

    tags = `
      <tr>
        <td>I:0/0</td>
        <td>START_PB</td>
        <td>Conveyor Start Push Button</td>
      </tr>

      <tr>
        <td>O:0/0</td>
        <td>CONVEYOR_MOTOR</td>
        <td>Conveyor Motor Output</td>
      </tr>
    `;

    alarms = `
      <tr>
        <td>ALM_003</td>
        <td>Conveyor Overload</td>
      </tr>
    `;

    sequence = `
      <li>Operator starts conveyor.</li>
      <li>Motor energizes.</li>
      <li>System monitors overload condition.</li>
    `;
  }

  // DEFAULT
  else{

    logicType = "Motor Start Stop Logic";

    drawMotorLogic(120);

    tags = `
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

    alarms = `
      <tr>
        <td>ALM_004</td>
        <td>Motor Overload Trip</td>
      </tr>
    `;

    sequence = `
      <li>Press start PB.</li>
      <li>Motor energizes.</li>
      <li>Press stop PB to stop motor.</li>
    `;
  }

  // OUTPUT SECTION
  document.getElementById("outputSection").innerHTML = `

    <h2 class="section-title">Generated Logic Details</h2>

    <table>

      <tr>
        <th>PLC Model</th>
        <th>Logic Type</th>
      </tr>

      <tr>
        <td>${plc}</td>
        <td>${logicType}</td>
      </tr>

    </table>

    <table>

      <tr>
        <th>Address</th>
        <th>Tag</th>
        <th>Description</th>
      </tr>

      ${tags}

    </table>

    <table>

      <tr>
        <th>Alarm ID</th>
        <th>Description</th>
      </tr>

      ${alarms}

    </table>

    <h2 class="section-title">Sequence Of Operation</h2>

    <ol>
      ${sequence}
    </ol>

  `;

}

// MOTOR LOGIC
function drawMotorLogic(y){

  const svg = document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1150" y2="${y}" class="rung"/>

    <line x1="180" y1="${y-20}" x2="180" y2="${y+20}" class="contact"/>
    <line x1="210" y1="${y-20}" x2="210" y2="${y+20}" class="contact"/>

    <text x="150" y="${y+45}" class="label">START</text>

    <line x1="340" y1="${y-20}" x2="340" y2="${y+20}" class="contact"/>
    <line x1="370" y1="${y-20}" x2="370" y2="${y+20}" class="contact"/>

    <line x1="335" y1="${y+20}" x2="375" y2="${y-20}" class="contact"/>

    <text x="320" y="${y+45}" class="label">STOP</text>

    <path d="
      M 800 ${y-20}
      Q 770 ${y} 800 ${y+20}

      M 840 ${y-20}
      Q 870 ${y} 840 ${y+20}
    " class="coil"/>

    <text x="760" y="${y+45}" class="label">MOTOR</text>

  `;
}

// EMERGENCY LOGIC
function drawEmergencyLogic(y){

  const svg = document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1150" y2="${y}" class="rung"/>

    <line x1="250" y1="${y-20}" x2="250" y2="${y+20}" class="contact"/>
    <line x1="280" y1="${y-20}" x2="280" y2="${y+20}" class="contact"/>

    <line x1="245" y1="${y+20}" x2="285" y2="${y-20}" class="contact"/>

    <text x="200" y="${y+45}" class="label">E-STOP</text>

    <path d="
      M 850 ${y-20}
      Q 820 ${y} 850 ${y+20}

      M 890 ${y-20}
      Q 920 ${y} 890 ${y+20}
    " class="coil"/>

    <text x="800" y="${y+45}" class="label">MOTOR OFF</text>

  `;
}

// PUMP LOGIC
function drawPumpLogic(y){

  const svg = document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1150" y2="${y}" class="rung"/>

    <line x1="180" y1="${y-20}" x2="180" y2="${y+20}" class="contact"/>
    <line x1="210" y1="${y-20}" x2="210" y2="${y+20}" class="contact"/>

    <text x="130" y="${y+45}" class="label">PUMP START</text>

    <line x1="400" y1="${y-20}" x2="400" y2="${y+20}" class="contact"/>
    <line x1="430" y1="${y-20}" x2="430" y2="${y+20}" class="contact"/>

    <text x="360" y="${y+45}" class="label">LEVEL OK</text>

    <path d="
      M 850 ${y-20}
      Q 820 ${y} 850 ${y+20}

      M 890 ${y-20}
      Q 920 ${y} 890 ${y+20}
    " class="coil"/>

    <text x="820" y="${y+45}" class="label">PUMP</text>

  `;
}

// CONVEYOR LOGIC
function drawConveyorLogic(y){

  const svg = document.getElementById("ladderSVG");

  svg.innerHTML += `

    <line x1="50" y1="${y}" x2="1150" y2="${y}" class="rung"/>

    <line x1="200" y1="${y-20}" x2="200" y2="${y+20}" class="contact"/>
    <line x1="230" y1="${y-20}" x2="230" y2="${y+20}" class="contact"/>

    <text x="170" y="${y+45}" class="label">START</text>

    <path d="
      M 850 ${y-20}
      Q 820 ${y} 850 ${y+20}

      M 890 ${y-20}
      Q 920 ${y} 890 ${y+20}
    " class="coil"/>

    <text x="780" y="${y+45}" class="label">CONVEYOR</text>

  `;
}

// PDF
async function downloadPDF(){

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  pdf.setFontSize(24);

  pdf.text("AI Master Vijay",20,20);

  pdf.setFontSize(18);

  pdf.text("PLC / DCS Logic Report",20,35);

  const plc =
  document.getElementById("plcModel").value;

  const prompt =
  document.getElementById("prompt").value;

  pdf.setFontSize(12);

  pdf.text(`PLC Model: ${plc}`,20,60);

  pdf.text(`Requirement: ${prompt}`,20,75);

  pdf.text("Generated by AI Master Vijay",20,110);

  pdf.save("PLC_DCS_Logic_Report.pdf");

}
