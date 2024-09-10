const { Web3 } = require("web3");

const { createPatient, addTestResult, addVitalSign, addMedication, addAllergy, addSurgery, addFamilyHistory, getPatientByPhone, getPatientMedicalHistory } = require('./functions');

// Initialize Web3 instance
const web3 = new Web3("http://127.0.0.1:8545/");

async function interact() {
    try {
        const accounts = await web3.eth.getAccounts();  // Fetch available accounts
        const defaultAccount = accounts[0];

        // Create a new patient
        const patientUUID = await createPatient("John Doe", "1234567890", 30, defaultAccount);

        // Add test result
        await addTestResult(patientUUID, "Blood Test", "Positive", defaultAccount);

        // Add vital signs
        await addVitalSign(patientUUID, "Blood Pressure", "120/80", defaultAccount);

        // Add medication
        await addMedication(patientUUID, "Flu", "Tamiflu", "10mg", 1633024800, 1633636800, defaultAccount);

        // Add allergy
        await addAllergy(patientUUID, "Peanuts", "Anaphylaxis", defaultAccount);

        // Add surgery
        await addSurgery(patientUUID, "Appendectomy", "Successful", 1633024800, defaultAccount);

        // Add family history
        await addFamilyHistory(patientUUID, "Father", "Heart Disease", "Had surgery at 60", defaultAccount);

        // Retrieve patient by phone
        await getPatientByPhone("1234567890");

        // Retrieve patient's medical history
        await getPatientMedicalHistory(patientUUID);

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Run the interaction
interact();
