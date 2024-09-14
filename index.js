// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    body.classList.toggle('dark-mode');
    
    const moonIcon = darkModeToggle.querySelector('.fa-moon');
    const sunIcon = darkModeToggle.querySelector('.fa-sun');
    
    if (body.classList.contains('dark-mode')) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline';
    } else {
        moonIcon.style.display = 'inline';
        sunIcon.style.display = 'none';
    }
}

// Button for Cable Loss Website
function openCableLossCalculator() {
    window.open('https://rajpatel113.github.io/CableLossCalculator/', '_blank');
}

// Function to set preset values based on the amplifier type for 1 GHz
function setPresetValues1() {
    const ampType = document.getElementById("ampType1").value;
    if (ampType === "BLE100") {
        document.getElementById("recommendedTilt").textContent = "Recommended Tilt: 4 dB";
    } else {
        document.getElementById("recommendedTilt").textContent = "Recommended Tilt: 0 dB";
    }
}

// Function to validate input values for 1 GHz
function validateInputs1() {
    const ampType = document.getElementById("ampType1").value;
    const ch15 = parseFloat(document.getElementById("ch15_1").value);
    const ch110 = parseFloat(document.getElementById("ch110_1").value);
    const ch135 = parseFloat(document.getElementById("ch135_1").value);
    const ch158 = parseFloat(document.getElementById("ch158_1").value);
    const errorMessages = document.getElementById("errorMessages1");

    let errors = [];

    // Ensure mandatory fields are filled correctly
    if (isNaN(ch15) || isNaN(ch110) || isNaN(ch135) || isNaN(ch158)) {
        errors.push("Please fill in all required fields (Ch15, Ch110, Ch135, Ch158).");
    } else {
        // Check minimum dBmV levels
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

        // Calculate input tilt automatically
        const calculatedTilt = ch15 - ch158;
        const idealTilt = ampType === "BLE100" ? 4 : 0; // BLE100 requires 4 dB, others require 0 dB tilt

        if (calculatedTilt !== idealTilt) {
            errors.push(`Calculated input tilt from ch15 to ch158 is ${calculatedTilt} dB. This is not the ideal tilt for ${ampType}.`);
        }
    }

    errorMessages.innerHTML = errors.join("<br>");
}

// Function to calculate the EQ and Pad values for 1 GHz
function calculateEQ1() {
    // Step 1: Validate input values
    validateInputs1();

    const ampType = document.getElementById("ampType1").value;
    const deltaType = document.getElementById("deltaType1").value;
    const ch15 = parseFloat(document.getElementById("ch15_1").value);
    const ch110 = parseFloat(document.getElementById("ch110_1").value);
    const ch135 = parseFloat(document.getElementById("ch135_1").value);
    const ch158 = parseFloat(document.getElementById("ch158_1").value);
    const tiltWarning = document.getElementById("tiltWarning1");

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

    // Lookup tables for insertion loss for each channel
    const eqCutLookup = {
        ch15: {
            "SFE-22": 16.1, "SFE-20": 14.2, "SFE-18": 13.0, "SFE-16": 11.2,
            "SFE-14": 10.0, "SFE-12": 9.0,  "SFE-10": 7.7,  "SFE-08": 6.6,
            "SFE-06": 4.8,  "SFE-04": 3.9,  "SFE-02": 2.5,  "SFE-00": 0.0,
            "SCS-2": 1.5,   "SCS-4": 1.5,   "SCS-6": 1.6,   "SCS-8": 2.1,
            "SCS-10": 2.2,  "SCS-12": 2.4,  "SCS-14": 2.7
        },
        ch110: {
            "SFE-22": 5.1, "SFE-20": 4.7, "SFE-18": 4.0, "SFE-16": 3.5,
            "SFE-14": 3.1, "SFE-12": 3.0, "SFE-10": 2.8, "SFE-08": 2.5,
            "SFE-06": 1.8, "SFE-04": 1.8, "SFE-02": 1.4, "SFE-00": 0.0,
            "SCS-2": 2.9,  "SCS-4": 4.7,  "SCS-6": 6.4,  "SCS-8": 8.9,
            "SCS-10": 10.3, "SCS-12": 11.5, "SCS-14": 13.0
        },
        ch135: {
            "SFE-22": 2.8, "SFE-20": 2.4, "SFE-18": 2.3, "SFE-16": 1.9,
            "SFE-14": 1.8, "SFE-12": 1.7, "SFE-10": 1.7, "SFE-08": 1.6,
            "SFE-06": 1.1, "SFE-04": 1.1, "SFE-02": 0.9, "SFE-00": 0.0,
            "SCS-2": 3.0,  "SCS-4": 5.1,  "SCS-6": 6.9,  "SCS-8": 9.7,
            "SCS-10": 11.5, "SCS-12": 12.9, "SCS-14": 14.9
        },
        ch158: {
            "SFE-22": 0.6, "SFE-20": 0.6, "SFE-18": 0.5, "SFE-16": 0.5,
            "SFE-14": 0.5, "SFE-12": 0.5, "SFE-10": 0.5, "SFE-08": 0.5,
            "SFE-06": 0.5, "SFE-04": 0.5, "SFE-02": 0.5, "SFE-00": 0.0,
            "SCS-2": 3.0,  "SCS-4": 5.5,  "SCS-6": 7.3,  "SCS-8": 9.9,
            "SCS-10": 12.2, "SCS-12": 13.8, "SCS-14": 16.3
        }
    };

    // Step 4: Find the lowest input channel
    const channelValues = [ch15, ch110, ch135, ch158];
    const channelKeys = ["ch15", "ch110", "ch135", "ch158"];

    const lowestInputChannel = Math.min(...channelValues);
    const lowestChannelIndex = channelValues.indexOf(lowestInputChannel);
    const lowestChannelKey = channelKeys[lowestChannelIndex];

    // Step 5: Determine the recommended input level based on the lowest channel for BLE100
    let recommendedInput;
    if (ampType === "BLE100") {
        if (lowestChannelKey === "ch15") {
            recommendedInput = 9;
        } else if (lowestChannelKey === "ch110") {
            recommendedInput = 10;
        } else if (lowestChannelKey === "ch135") {
            recommendedInput = 11;
        } else if (lowestChannelKey === "ch158") {
            recommendedInput = 13;
        }
    } else {
        recommendedInput = 8; // For MB100 and BTD100, use 8 dBmV
    }

    // Step 6: Determine insertion loss for the lowest channel
    const insertionLoss = eqCutLookup[lowestChannelKey][`${eqType}-${eqValue}`] || 0;

    // Step 7: Calculate the Pad Value
    let padValue = lowestInputChannel - recommendedInput - insertionLoss;
    padValue = Math.max(0, Math.round(padValue)); // Ensure pad value is non-negative

    // Step 8: Display Results
    document.getElementById("eqValue1").textContent = `Recommended ${eqType} Value: ${eqType}-100-${eqValue}`;
    document.getElementById("padValue1").textContent = `Recommended Pad Value: ${padValue} dB`;
    startADUPadCalculation();
}

// Function to start ADU Pad calculation
function startADUPadCalculation() {
    // Step 1: Show instructions for ADU adjustment
    const aduInstructions = `
        <p><strong>1. Adjust the output levels of the amplifier by adjusting the pad in the MID/INTERSTAGE location until the output levels align to recommended output levels +/- 3 dB. If MB or BT, confirm the outputs on all active ports to ensure equal gain.</strong></p>
        <p><strong>2. Please enter the output level on Channel 110 (in dBmV):</strong></p>
        <input type="number" id="ch110OutputLevel" class="form-control" required max="99">
        <button class="btn btn-success mt-2" onclick="calculateADUPad()"><i class="fas fa-cogs"></i> Calculate ADU Pad</button>
    `;
    document.getElementById("aduInstructions1").innerHTML = aduInstructions;
}

// Function to calculate ADU Pad
function calculateADUPad() {
    const ampType = document.getElementById("ampType1").value;
    const ch110OutputLevel = parseFloat(document.getElementById("ch110OutputLevel").value);

    let aduPadValue;
    if (isNaN(ch110OutputLevel)) {
        document.getElementById("aduResults1").innerHTML = `<p class="text-danger">Please enter a valid output level for Channel 110.</p>`;
        return;
    }

    // Perform calculation based on amplifier type
    if (ampType === "BLE100" || ampType === "BTD100") {
        aduPadValue = ch110OutputLevel - 42; // Subtract 42 for BLE or BT
    } else if (ampType === "MB100") {
        aduPadValue = ch110OutputLevel - 37; // Subtract 37 for MB
    } else {
        document.getElementById("aduResults1").innerHTML = `<p class="text-danger">Invalid amplifier type selected.</p>`;
        return;
    }

    // Ensure ADU pad value is not below 0
    aduPadValue = Math.max(0, Math.round(aduPadValue)); // Set to 0 if calculated value is below 0

    // Show the ADU Pad result
    document.getElementById("aduResults1").innerHTML = `
        <p>Recommended ADU Pad Value: ${aduPadValue} dB</p>
        <p><strong>3. Finally, move the “MAN” “AUTO” jumper to “AUTO” and adjust the ADU Potentiometer control to reset the channels to the same power levels in manual mode.</strong></p>
    `;
}
