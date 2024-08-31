
  // Function to toggle dark mode
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".container").classList.toggle("dark-mode");
  }
  // Button for Cableloss Website
function openCableLossCalculator() {
  window.open('https://rajpatel113.github.io/CableLossCalculator/', '_blank');
}

  // Function to set preset values based on the amplifier type
  function setPresetValues() {
    const ampType = document.getElementById("ampType").value;
    const inputTilt = document.getElementById("inputTilt");

    if (ampType === "BLE100") {
      inputTilt.value = 4; // 4 dB tilt for BLE100
    } else if (ampType === "MB100" || ampType === "BTD100") {
      inputTilt.value = 0; // Flat input (0 dB tilt) for MB100 and BTD100
    }
  }

  // Function to validate input values
  function validateInputs() {
    const ampType = document.getElementById("ampType").value;
    const ch15 = parseFloat(document.getElementById("ch15").value);
    const ch110 = parseFloat(document.getElementById("ch110").value);
    const ch135 = parseFloat(document.getElementById("ch135").value);
    const ch158 = parseFloat(document.getElementById("ch158").value);
    const errorMessages = document.getElementById("errorMessages");

    let errors = [];

    if (ampType === "BLE100") {
      if (ch15 < 6) errors.push("Channel 15 should be at least 6 dBmV for BLE100.");
      if (ch110 < 7) errors.push("Channel 110 should be at least 7 dBmV for BLE100.");
      if (ch135 < 8) errors.push("Channel 135 should be at least 8 dBmV for BLE100.");
      if (ch158 < 10) errors.push("Channel 158 should be at least 10 dBmV for BLE100.");
    } else if (ampType === "MB100" || ampType === "BTD100") {
      if (ch15 < 5) errors.push("Channel 15 should be at least 5 dBmV for MB100 and BTD100.");
      if (ch110 < 5) errors.push("Channel 110 should be at least 5 dBmV for MB100 and BTD100.");
      if (ch135 < 5) errors.push("Channel 135 should be at least 5 dBmV for MB100 and BTD100.");
      if (ch158 < 5) errors.push("Channel 158 should be at least 5 dBmV for MB100 and BTD100.");
    }

    errorMessages.innerHTML = errors.join("<br>");
  }

  // Function to calculate the EQ and Pad values
  function calculateEQ() {
    const ampType = document.getElementById("ampType").value;
    const deltaType = document.getElementById("deltaType").value;
    const ch15 = parseFloat(document.getElementById("ch15").value);
    const ch110 = parseFloat(document.getElementById("ch110").value);
    const ch135 = parseFloat(document.getElementById("ch135").value);
    const ch158 = parseFloat(document.getElementById("ch158").value);
    const inputTilt = parseFloat(document.getElementById("inputTilt").value);
    const tiltWarning = document.getElementById("tiltWarning");

    // Step 1: Validate Input Tilt
    if ((ampType === "BLE100" && inputTilt !== 4) || ((ampType === "MB100" || ampType === "BTD100") && inputTilt !== 0)) {
      tiltWarning.textContent = "This is not an ideal tilt for input. Please check previous amplifier configurations.";
    } else {
      tiltWarning.textContent = ""; // Clear warning if tilt is correct
    }

    // Step 2: Calculate Delta based on selected delta type
    let delta;
    switch (deltaType) {
      case "Ch15-110":
        delta = ch15 - ch110;
        break;
      case "Ch15-135":
        delta = ch15 - ch135;
        break;
      case "Ch15-158":
      default:
        delta = ch15 - ch158;
        break;
    }

    // Adjust Delta for BLE100 amplifier type
    if (ampType === "BLE100") {
      delta += 4;
    }

    // Lookup tables for SFE and SCS values based on delta type
    let sfeOptions, scsOptions;

    if (deltaType === "Ch15-110") {
      sfeOptions = [
        { delta: 11.1, value: 22 }, { delta: 9.5, value: 20 },
        { delta: 9.0, value: 18 }, { delta: 7.8, value: 16 },
        { delta: 6.9, value: 14 }, { delta: 6.0, value: 12 },
        { delta: 4.9, value: 10 }, { delta: 4.1, value: 8 },
        { delta: 3.0, value: 6 }, { delta: 2.1, value: 4 },
        { delta: 1.1, value: 2 }, { delta: 0.0, value: 0 }
      ];
      scsOptions = [
        { delta: -0.3, value: 2 }, { delta: -1.9, value: 4 },
        { delta: -3.0, value: 6 }, { delta: -4.8, value: 8 },
        { delta: -6.1, value: 10 }, { delta: -7.0, value: 12 },
        { delta: -8.3, value: 14 }
      ];
    } else if (deltaType === "Ch15-135") {
      sfeOptions = [
        { delta: 13.3, value: 22 }, { delta: 11.8, value: 20 },
        { delta: 10.7, value: 18 }, { delta: 9.3, value: 16 },
        { delta: 8.2, value: 14 }, { delta: 7.2, value: 12 },
        { delta: 6.0, value: 10 }, { delta: 5.0, value: 8 },
        { delta: 3.7, value: 6 }, { delta: 2.8, value: 4 },
        { delta: 1.6, value: 2 }, { delta: 0.0, value: 0 }
      ];
      scsOptions = [
        { delta: -1.6, value: 2 }, { delta: -3.6, value: 4 },
        { delta: -5.3, value: 6 }, { delta: -7.6, value: 8 },
        { delta: -9.3, value: 10 }, { delta: -10.5, value: 12 },
        { delta: -12.2, value: 14 }
      ];
    } else { // Ch15-158
      sfeOptions = [
        { delta: 15.5, value: 22 }, { delta: 13.6, value: 20 },
        { delta: 12.5, value: 18 }, { delta: 10.8, value: 16 },
        { delta: 9.5, value: 14 }, { delta: 8.5, value: 12 },
        { delta: 7.2, value: 10 }, { delta: 6.1, value: 8 },
        { delta: 4.3, value: 6 }, { delta: 3.4, value: 4 },
        { delta: 2.0, value: 2 }, { delta: 0.0, value: 0 }
      ];
      scsOptions = [
        { delta: -1.4, value: 2 }, { delta: -3.2, value: 4 },
        { delta: -4.8, value: 6 }, { delta: -6.8, value: 8 },
        { delta: -8.1, value: 10 }, { delta: -9.0, value: 12 },
        { delta: -10.3, value: 14 }
      ];
    }

    let eqType, eqValue;

    // Step 3: Determine the closest EQ or CS based on Delta
    if (delta === 0) {
      eqType = "SFE";
      eqValue = 0; // SFE-100-00
    } else if (delta >= 2) {
      eqType = "SFE";
      eqValue = sfeOptions.reduce((prev, curr) => Math.abs(curr.delta - delta) < Math.abs(prev.delta - delta) ? curr : prev).value;
    } else {
      eqType = "SCS";
      eqValue = scsOptions.reduce((prev, curr) => Math.abs(curr.delta - delta) < Math.abs(prev.delta - delta) ? curr : prev).value;
    }

    // Lookup table for EQ/CS cut values at Channel 15
    const eqCutAtCh15Lookup = {
      "SFE-22": 16.1, "SFE-20": 14.2, "SFE-18": 13.0, "SFE-16": 11.2,
      "SFE-14": 10.0, "SFE-12": 9.0,  "SFE-10": 7.7,  "SFE-08": 6.6,
      "SFE-06": 4.8,  "SFE-04": 3.9,  "SFE-02": 2.5,  "SFE-00": 0.0,
      "SCS-2": 1.5,   "SCS-4": 1.5,   "SCS-6": 1.6,   "SCS-8": 2.1,
      "SCS-10": 2.2,  "SCS-12": 2.4,  "SCS-14": 2.7
    };

    // Step 4: Find the EQ/CS Cut at Channel 15
    let eqCutAtCh15 = eqCutAtCh15Lookup[`${eqType}-${eqValue}`] || 0;

    // Step 5: Determine the Recommended Input for the Selected Amplifier
    let recommendedInput = ampType === "BLE100" ? 9 : 8; // BLE100 requires 9 dBmV, MB100 and BTD100 require 8 dBmV

    // Step 6: Calculate the First Pad Value
    let padValue = recommendedInput - eqCutAtCh15 - ch15;
    if (padValue < 0) {
      padValue = 0; // Use 0 dB if the result is negative
    }

    // Step 7: Display Results
    document.getElementById("eqValue").textContent = `Recommended ${eqType} Value: ${eqType}-100-${eqValue}`;
    document.getElementById("padValue").textContent = `Recommended Pad Value: ${padValue} dB`;
  }

