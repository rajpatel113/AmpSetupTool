// Function to set preset values based on the amplifier type for 1.2 GHz
function setPresetValues12() {
    const ampType = document.getElementById("ampType12").value;
    if (ampType === "BLE120") {
        document.getElementById("tiltWarning12").textContent = "Recommended Input Tilt: 2 dB";
    } else {
        document.getElementById("tiltWarning12").textContent = "Recommended Input Tilt: 0 dB";
    }
}

// Function to validate input values for 1.2 GHz
function validateInputs12() {
    const ampType = document.getElementById("ampType12").value;
    const ch30 = parseFloat(document.getElementById("ch30_12").value);
    const ch110 = parseFloat(document.getElementById("ch110_12").value);
    const ch135 = parseFloat(document.getElementById("ch135_12").value);
    const ch158 = parseFloat(document.getElementById("ch158_12").value);
    const ch191 = parseFloat(document.getElementById("ch191_12").value);
    const errorMessages = document.getElementById("errorMessages12");

    let errors = [];

    // Ensure mandatory fields are filled correctly
    if (isNaN(ch30) || isNaN(ch110) || isNaN(ch135) || isNaN(ch158) || isNaN(ch191)) {
        errors.push("Please fill in all required fields (Ch30, Ch110, Ch135, Ch158, Ch191).");
    } else {
        // Check minimum dBmV levels for BLE120
        if (ampType === "BLE120") {
            if (ch30 < 7) errors.push("Channel 30 should be at least 7 dBmV for BLE120.");
            if (ch135 < 8) errors.push("Channel 135 should be at least 9 dBmV for BLE120.");
            if (ch158 < 9) errors.push("Channel 158 should be at least 9 dBmV for BLE120.");
            if (ch191 < 9) errors.push("Channel 191 should be at least 9 dBmV for BLE120.");
        } else if (ampType === "MB120") {
            if (ch30 < 5) errors.push("Channel 30 should be at least 5 dBmV for MB120.");
            if (ch110 < 5) errors.push("Channel 110 should be at least 5 dBmV for MB120.");
            if (ch135 < 5) errors.push("Channel 135 should be at least 5 dBmV for MB120.");
            if (ch158 < 5) errors.push("Channel 158 should be at least 5 dBmV for MB120.");
            if (ch191 < 5) errors.push("Channel 191 should be at least 5 dBmV for MB120.");
        }

        // Calculate input tilt automatically
        const calculatedTilt = ch30 - ch191;
        const idealTilt = ampType === "BLE120" ? 2 : 0; // BLE120 requires 2 dB, others require 0 dB tilt

        if (calculatedTilt !== idealTilt) {
            errors.push(`Calculated input tilt from ch30 to ch191 is ${calculatedTilt} dB. This is not the ideal tilt for ${ampType}.`);
        }
    }

    errorMessages.innerHTML = errors.join("<br>");
}

// Function to calculate the EQ and Pad values for 1.2 GHz
function calculateEQ120() {
    // Step 1: Validate input values
    validateInputs12();

    const ampType = document.getElementById("ampType12").value;
    const deltaType = document.getElementById("deltaType12").value;
    const ch30 = parseFloat(document.getElementById("ch30_12").value);
    const ch110 = parseFloat(document.getElementById("ch110_12").value);
    const ch135 = parseFloat(document.getElementById("ch135_12").value);
    const ch158 = parseFloat(document.getElementById("ch158_12").value);
    const ch191 = parseFloat(document.getElementById("ch191_12").value);
    const tiltWarning = document.getElementById("tiltWarning12");

    // Step 2: Calculate Delta based on selected delta type
    let delta;
    switch (deltaType) {
        case "Ch30-110":
            delta = ch30 - ch110;
            break;
        case "Ch30-135":
            delta = ch30 - ch135;
            break;
        case "Ch30-158":
            delta = ch30 - ch158;
            break;
        case "Ch30-191":
        default:
            delta = ch30 - ch191;
            break;
    }
        // Adjust Delta for BLE120 amplifier type
        if (ampType === "BLE120") {
            delta += 2;
        }

    // Lookup tables for EQ and CS values based on delta type
    let ceOptions, csOptions;
    if (deltaType === "Ch30-110") {
        ceOptions = [
            { delta: 7.1, value: 20 }, { delta: 6.8, value: 19 }, { delta: 6.5, value: 18 }, { delta: 6.3, value: 17 },
            { delta: 5.7, value: 16 }, { delta: 5.6, value: 15 }, { delta: 5.1, value: 14 }, { delta: 4.8, value: 13 },
            { delta: 4.4, value: 12 }, { delta: 4.1, value: 11 }, { delta: 3.4, value: 10 }, { delta: 3.1, value: 9 },
            { delta: 2.8, value: 8 }, { delta: 2.6, value: 7 }, { delta: 2.4, value: 6 }, { delta: 1.9, value: 5 },
            { delta: 1.3, value: 4 }, { delta: 1.3, value: 3 }, { delta: 1.0, value: 2 },{ delta: 0.0, value: 0 }
        ];
        csOptions = [
            { delta: -0.3, value: 1 }, { delta: -0.9, value: 2 }, { delta: -1.3, value: 3 }, { delta: -1.9, value: 4 },
            { delta: -2.2, value: 5 }, { delta: -2.5, value: 6 }, { delta: -3.3, value: 7 }, { delta: -3.5, value: 8 },
            { delta: -4.3, value: 9 }, { delta: -4.6, value: 10 }
        ];
    } else if (deltaType === "Ch30-135") {
        ceOptions = [
            { delta: 8.8, value: 20 }, { delta: 8.1, value: 19 }, { delta: 8.0, value: 18 }, { delta: 7.5, value: 17 },
            { delta: 7.0, value: 16 }, { delta: 6.7, value: 15 }, { delta: 6.1, value: 14 }, { delta: 5.8, value: 13 },
            { delta: 5.7, value: 12 }, { delta: 4.8, value: 11 }, { delta: 3.8, value: 10 }, { delta: 3.5, value: 9 },
            { delta: 3.1, value: 8 }, { delta: 2.7, value: 7 }, { delta: 2.5, value: 6 }, { delta: 2.4, value: 5 },
            { delta: 1.4, value: 4 }, { delta: 1.4, value: 3 }, { delta: 1.1, value: 2 },{ delta: 0.0, value: 0 }
        ];
        csOptions = [
            { delta: -0.6, value: 1 }, { delta: -1.2, value: 2 }, { delta: -1.4, value: 3 }, { delta: -2.4, value: 4 },
            { delta: -2.7, value: 5 }, { delta: -3.4, value: 6 }, { delta: -4.2, value: 7 }, { delta: -4.6, value: 8 },
            { delta: -5.5, value: 9 }, { delta: -6.2, value: 10 }
        ];
    } else if (deltaType === "Ch30-158") {
        ceOptions = [
            { delta: 10.9, value: 20 }, { delta: 10.0, value: 19 }, { delta: 10.0, value: 18 }, { delta: 9.2, value: 17 },
            { delta: 8.6, value: 16 }, { delta: 7.3, value: 15 }, { delta: 7.8, value: 14 }, { delta: 6.3, value: 13 },
            { delta: 6.5, value: 12 }, { delta: 5.2, value: 11 }, { delta: 5.1, value: 10 }, { delta: 3.7, value: 9 },
            { delta: 4.2, value: 8 }, { delta: 3.7, value: 7 }, { delta: 3.3, value: 6 }, { delta: 2.5, value: 5 },
            { delta: 2.1, value: 4 }, { delta: 1.9, value: 3 }, { delta: 1.6, value: 2 },{ delta: 0.0, value: 0 }
        ];
        csOptions = [
            { delta: -0.9, value: 1 }, { delta: -1.4, value: 2 }, { delta: -1.5, value: 3 }, { delta: -2.7, value: 4 },
            { delta: -3.1, value: 5 }, { delta: -3.9, value: 6 }, { delta: -4.9, value: 7 }, { delta: -5.4, value: 8 },
            { delta: -6.3, value: 9 }, { delta: -7.3, value: 10 }
        ];
    } else { // Ch30-191
        ceOptions = [
            { delta: 13.3, value: 20 }, { delta: 12.6, value: 19 }, { delta: 12.1, value: 18 }, { delta: 11.8, value: 17 },
            { delta: 10.7, value: 16 }, { delta: 10.4, value: 15 }, { delta: 9.6, value: 14 }, { delta: 9.1, value: 13 },
            { delta: 8.2, value: 12 }, { delta: 7.8, value: 11 }, { delta: 6.7, value: 10 }, { delta: 6.1, value: 9 },
            { delta: 5.5, value: 8 }, { delta: 4.9, value: 7 }, { delta: 4.3, value: 6 }, { delta: 3.3, value: 5 },
            { delta: 2.7, value: 4 }, { delta: 2.2, value: 3 }, { delta: 1.6, value: 2 },{ delta: 0.0, value: 0 }
        ];
        csOptions = [
            { delta: -1.0, value: 1 }, { delta: -2.6, value: 2 }, { delta: -3.1, value: 3 }, { delta: -3.8, value: 4 },
            { delta: -4.7, value: 5 }, { delta: -5.3, value: 6 }, { delta: -6.5, value: 7 }, { delta: -7.2, value: 8 },
            { delta: -8.6, value: 9 }, { delta: -9.9, value: 10 }
        ];
    }

    let eqType, eqValue;

    // Step 3: Determine the closest EQ or CS based on Delta
    if (delta === 0) {
        eqType = "CE";
        eqValue = 0;
    } else if (delta >= 1) {
        eqType = "CE";
        eqValue = ceOptions.reduce((prev, curr) => Math.abs(curr.delta - delta) < Math.abs(prev.delta - delta) ? curr : prev).value;
    } else {
        eqType = "CS";
        eqValue = csOptions.reduce((prev, curr) => Math.abs(curr.delta - delta) < Math.abs(prev.delta - delta) ? curr : prev).value;
    }

    // Lookup tables for insertion loss for each channel
    const eqCutLookup = {
        ch30: {
          "CE-120-20": 14.3,
          "CE-120-19": 13.6,
          "CE-120-18": 13.1,
          "CE-120-17": 12.5,
          "CE-120-16": 11.7,
          "CE-120-15": 11.1,
          "CE-120-14": 10.4,
          "CE-120-13": 9.9,
          "CE-120-12": 9.2,
          "CE-120-11": 8.5,
          "CE-120-10": 7.5,
          "CE-120-09": 6.8,
          "CE-120-08": 6.2,
          "CE-120-07": 5.6,
          "CE-120-06": 5.0,
          "CE-120-05": 4.2,
          "CE-120-04": 3.5,
          "CE-120-03": 2.9,
          "CE-120-02": 2.3,
          "CS-120-1": 1.0,
          "CS-120-2": 1.1,
          "CS-120-3": 1.5,
          "CS-120-4": 1.7,
          "CS-120-5": 2.2,
          "CS-120-6": 2.3,
          "CS-120-7": 2.5,
          "CS-120-8": 2.9,
          "CS-120-9": 3.1,
          "CS-120-10": 3.4,
        },
        ch135: {
          "CE-120-20": 5.5,
          "CE-120-19": 5.5,
          "CE-120-18": 5.1,
          "CE-120-17": 5.0,
          "CE-120-16": 4.7,
          "CE-120-15": 4.4,
          "CE-120-14": 4.3,
          "CE-120-13": 4.1,
          "CE-120-12": 3.5,
          "CE-120-11": 3.7,
          "CE-120-10": 3.7,
          "CE-120-09": 3.3,
          "CE-120-08": 3.1,
          "CE-120-07": 2.9,
          "CE-120-06": 2.5,
          "CE-120-05": 1.8,
          "CE-120-04": 2.1,
          "CE-120-03": 1.5,
          "CE-120-02": 1.2,
          "CS-120-1": 1.6,
          "CS-120-2": 2.3,
          "CS-120-3": 2.9,
          "CS-120-4": 4.1,
          "CS-120-5": 4.9,
          "CS-120-6": 5.7,
          "CS-120-7": 6.7,
          "CS-120-8": 7.5,
          "CS-120-9": 8.6,
          "CS-120-10": 9.6,
        },
        ch158: {
          "CE-120-20": 3.4,
          "CE-120-19": 3.6,
          "CE-120-18": 3.1,
          "CE-120-17": 3.3,
          "CE-120-16": 3.1,
          "CE-120-15": 3.8,
          "CE-120-14": 2.6,
          "CE-120-13": 3.6,
          "CE-120-12": 2.7,
          "CE-120-11": 3.3,
          "CE-120-10": 2.4,
          "CE-120-09": 3.1,
          "CE-120-08": 2.0,
          "CE-120-07": 1.9,
          "CE-120-06": 1.7,
          "CE-120-05": 1.7,
          "CE-120-04": 1.4,
          "CE-120-03": 1.0,
          "CE-120-02": 0.7,
          "CS-120-1": 1.9,
          "CS-120-2": 2.5,
          "CS-120-3": 3.0,
          "CS-120-4": 4.4,
          "CS-120-5": 5.3,
          "CS-120-6": 6.2,
          "CS-120-7": 7.4,
          "CS-120-8": 8.3,
          "CS-120-9": 9.4,
          "CS-120-10": 10.7,
        },
        ch191: {
          "CE-120-20": 1.0,
          "CE-120-19": 1.0,
          "CE-120-18": 1.0,
          "CE-120-17": 0.7,
          "CE-120-16": 1.0,
          "CE-120-15": 0.7,
          "CE-120-14": 0.8,
          "CE-120-13": 0.8,
          "CE-120-12": 1.0,
          "CE-120-11": 0.7,
          "CE-120-10": 0.8,
          "CE-120-09": 0.7,
          "CE-120-08": 0.7,
          "CE-120-07": 0.7,
          "CE-120-06": 0.9,
          "CE-120-05": 0.9,
          "CE-120-04": 0.8,
          "CE-120-03": 0.7,
          "CE-120-02": 0.7,
          "CS-120-1": 2.0,
          "CS-120-2": 3.7,
          "CS-120-3": 4.6,
          "CS-120-4": 5.5,
          "CS-120-5": 6.9,
          "CS-120-6": 7.6,
          "CS-120-7": 9.0,
          "CS-120-8": 10.1,
          "CS-120-9": 11.7,
          "CS-120-10": 13.3,
        },
      };

    // Step 4: Find the lowest input channel
    const channelValues = [ch30, ch135, ch158, ch191];
    const channelKeys = ["ch30", "ch135", "ch158", "ch191"];

    const lowestInputChannel = Math.min(...channelValues);
    const lowestChannelIndex = channelValues.indexOf(lowestInputChannel);
    const lowestChannelKey = channelKeys[lowestChannelIndex];

    // Step 5: Determine the recommended input level based on the lowest channel for BLE120
    let recommendedInput;
    if (ampType === "BLE120") {
        if (lowestChannelKey === "ch30") {
            recommendedInput = 10;
        } else if (lowestChannelKey === "ch135") {
            recommendedInput = 11;
        } else if (lowestChannelKey === "ch158") {
            recommendedInput = 12;
        } else if (lowestChannelKey === "ch191") {
            recommendedInput = 12;
        }
    } else {
        recommendedInput = 8; // For MB120, use 8 dBmV
    }

    // Step 6: Determine insertion loss for the lowest channel
    const insertionLoss = eqCutLookup[lowestChannelKey][`${eqType}-120-${eqValue}`] || 0;

    // Step 7: Calculate the Pad Value
    let padValue = lowestInputChannel - recommendedInput - insertionLoss;
    padValue = Math.max(0, Math.round(padValue)); // Ensure pad value is non-negative

    // Step 8: Display Results
    document.getElementById("eqValue12").textContent = `Recommended ${eqType} Value: ${eqType}-120-${eqValue}`;
    document.getElementById("padValue12").textContent = `Recommended Pad Value: ${padValue} dB`;
    document.getElementById("aduInstructions12").textContent = "As the 120/204 amps ADUs also compensates the return path, the return setup must be completed before enabling and adjusting the ADU.";
}