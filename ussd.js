// Import express and body-parser
const express = require('express');
const bodyParser = require('body-parser');

// web3 configs 
const { Web3 } = require("web3");
const { createPatient, addTestResult, addVitalSign, addMedication, addAllergy, addSurgery, addFamilyHistory, getPatientByPhone, getPatientMedicalHistory,getAllThePatients } = require('./functions');
const { response } = require("express");
// Initialize Web3 instance
const web3 = new Web3("http://127.0.0.1:8545/");
//expresso configs 


// Initialize express app
const app = express();

// Use body-parser to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu();
// Define menu states
menu.startState({
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('Welcome to MMIMI' +
            '\n1. Access My Account' +
            '\n2. Access A Patient Account');
    },
    // next object links to next state based on user input
    next: {
        '1': 'showAccountData',
        '2': 'verifyDoctor'
    }
});
//user data navigations 
menu.state('showAccountData', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('Select category  to access ' +
            '\n1. Medications' +
            '\n2. Tests' +
            '\n3. Surgeries' +
            '\n4. Alergies' +
            '\n5. Exit');
            
    },
    // next object links to next state based on user input
    next: {

        '1': 'showMedications',
        '2': 'showTests',
        '3': 'ShowSurgeries',
        '4': 'ShowAlergies',
        '5': 'Exit'
 
    }
});

//show Medications
//STATUS: Done1!
menu.state('showMedications', {
    run: async () => {
        console.log("Fetching Medications");

        let session_data = menu.args.text.split('*');

        if (session_data[0] == "1") { 
            try {
                // Fetch the patient's allergies using their phone number
                let patient = await getPatientByPhone(menu.args.phoneNumber);
                let medications   = patient['patient']['medicalHistory']['medications'];

                // Sort allergies by timestamp in descending order (most recent first)
                medications.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

                // Get up to the first 3 allergies
                let recentMedications = medications.slice(0, 3);

                // Create the output string
                let medicationsMessage = 'Most recent Surgaries:\n';
                recentMedications.forEach((medication, index) => {
                    medicationsMessage += `${index + 1}. Illness: ${medication.illness} - Medication:  ${medication.medicationName } dosage:  ${medication.dosage}\n`;
                });

                // If no allergies are found
                if (recentMedications.length === 0) {
                    medicationsMessage = 'No allergies found for this patient.';
                }

                menu.con(medicationsMessage + '\n00: Home');
            } catch (error) {
                console.error("Error fetching allergies:", error);
                menu.con('An error occurred while fetching allergies. Please try again later.\n00: Home');
            }
        } else {
            console.log("Accessing patient data...");
        }
    },
    next: {
        // Return to the account data screen or handle navigation
        '*\\d+': 'showAccountData'
    }
});


//show Tests
//STATUS: Done1!
menu.state('showTests', {
    run: async () => {
        console.log("Fetching Test");

        let session_data = menu.args.text.split('*');

        if (session_data[0] == "1") { 
            try {
                // Fetch the patient's allergies using their phone number
                let patient = await getPatientByPhone(menu.args.phoneNumber);
                let tests   = patient['patient']['medicalHistory']['tests'];

                // Sort allergies by timestamp in descending order (most recent first)
                tests.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

                // Get up to the first 3 allergies
                let recenTests = tests.slice(0, 3);

                // Create the output string
                let testMessage = 'Most recent Tests:\n';
                recenTests.forEach((test, index) => {
                    testMessage += `${index + 1}. TestName: ${test.testName} - Result:  ${test.result} \n`;
                });

                // If no allergies are found
                if (recenTests.length === 0) {
                    testMessage = 'No allergies found for this patient.';
                }

                menu.con(testMessage + '\n00: Home');
            } catch (error) {
                console.error("Error fetching tests:", error);
                menu.con('An error occurred while fetching tests. Please try again later.\n00: Home');
            }
        } else {
            console.log("Accessing patient data...");
        }
    },
    next: {
        // Return to the account data screen or handle navigation
        '*\\d+': 'showAccountData'
    }
});

//show Surgaries
//STATUS: Done1!
menu.state('ShowSurgeries', {
    run: async () => {
        console.log("Fetching allergies...");

        let session_data = menu.args.text.split('*');

        if (session_data[0] == "1") { 
            try {
                // Fetch the patient's allergies using their phone number
                let patient = await getPatientByPhone(menu.args.phoneNumber);
                let surgeries   = patient['patient']['medicalHistory']['surgeries'];

                // Sort allergies by timestamp in descending order (most recent first)
                surgeries.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

                // Get up to the first 3 allergies
                let recentSurgeries = surgeries.slice(0, 3);

                // Create the output string
                let surgeryMessage = 'Most recent Surgaries:\n';
                recentSurgeries.forEach((surgery, index) => {
                    surgeryMessage += `${index + 1}. Type: ${surgery.surgeryType} - Outcome: ${surgery.outcome}\n`;
                });

                // If no allergies are found
                if (recentSurgeries.length === 0) {
                    surgeryMessage = 'No allergies found for this patient.';
                }

                menu.con(surgeryMessage + '\n00: Home');
            } catch (error) {
                console.error("Error fetching allergies:", error);
                menu.con('An error occurred while fetching allergies. Please try again later.\n00: Home');
            }
        } else {
            console.log("Accessing patient data...");
        }
    },
    next: {
        // Return to the account data screen or handle navigation
        '*\\d+': 'showAccountData'
    }
});

//show Allergies
//STATUS: Done1!
menu.state('ShowAlergies', {
    run: async () => {
        console.log("Fetching allergies...");

        let session_data = menu.args.text.split('*');

        if (session_data[0] == "1") { 
            try {
                // Fetch the patient's allergies using their phone number
                let patient = await getPatientByPhone(menu.args.phoneNumber);
                let allergies = patient['patient']['medicalHistory']['allergies'];

                // Sort allergies by timestamp in descending order (most recent first)
                allergies.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

                // Get up to the first 3 allergies
                let recentAllergies = allergies.slice(0, 3);

                // Create the output string
                let allergyMessage = 'Most recent allergies:\n';
                recentAllergies.forEach((allergy, index) => {
                    allergyMessage += `${index + 1}. ${allergy.allergen} - Reaction: ${allergy.reaction}\n`;
                });

                // If no allergies are found
                if (recentAllergies.length === 0) {
                    allergyMessage = 'No allergies found for this patient.';
                }

                menu.con(allergyMessage + '\n00: Home');
            } catch (error) {
                console.error("Error fetching allergies:", error);
                menu.con('An error occurred while fetching allergies. Please try again later.\n00: Home');
            }
        } else {
            console.log("Accessing patient data...");
        }
    },
    next: {
        // Return to the account data screen or handle navigation
        '*\\d+': 'showAccountData'
    }
});



// nesting states
menu.state('Exit', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        // buyAirtime(menu.args.phoneNumber, amount).then(function(res){
        menu.end('You have left Mmimi');
        // });
    }
});

// Registering USSD handler with Express

app.post('/ussd', function(req, res){
    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
});


// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
