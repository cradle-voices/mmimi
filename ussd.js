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
let sessions = {};

menu.sessionConfig({
    start: (sessionId, callback) => {
        if(!(sessionId in sessions)) sessions[sessionId] = {};
        callback();
    },
    end: (sessionId, callback) => {
        delete sessions[sessionId];
        callback();
    },
    set: (sessionId, key, value, callback) => {
        sessions[sessionId][key] = value;
        callback();
    },
    get: (sessionId, key, callback) => {
        let value = sessions[sessionId][key];
        callback(null, value);
    }
});

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
        '2': 'verifyDoctorAccess'
    }
});
// patient navigation states ...
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
        //console.log(menu.args.phoneNumber)

        let session_data = menu.args.text.split('*');

        if (session_data[0] == "1") { 
            try {
                // Fetch the patient's allergies using their phone number
                let patient = await getPatientByPhone(menu.args.phoneNumber);
                //console.log(patient);
                
                let medications   = patient['patient']['medicalHistory']['medications'];
                

                // Sort allergies by timestamp in descending order (most recent first)
                medications.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

                // Get up to the first 3 allergies
                let recentMedications = medications.slice(0, 3);

                // Create the output string
                let medicationsMessage = 'Most recent Medications:\n';
                recentMedications.forEach((medication, index) => {
                    medicationsMessage += `${index + 1}. Illness: ${medication.illness} - Medication:  ${medication.medicationName } dosage:  ${medication.dosage}\n`;
                });

                // If no allergies are found
                if (recentMedications.length === 0) {
                    medicationsMessage = 'No Medication found for this patient.';
                }

                menu.con(medicationsMessage + '\n00: Home');
                
            } catch (error) {
                console.error("Error fetching allergies:", error);
                menu.con('An error occurred while fetching allergies. Please try again later.\n00: Home');
            }
        } else {
            //get the patient number 
            // console.log(session_data[1]);
            // Fetch the patient's allergies using their phone number
            let patient = await getPatientByPhone(session_data[1]);
            //console.log(patient);
            
            let medications   = patient['patient']['medicalHistory']['medications'];
            

            // Sort allergies by timestamp in descending order (most recent first)
            medications.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

            // Get up to the first 3 allergies
            let recentMedications = medications.slice(0, 3);

            // Create the output string
            let medicationsMessage = 'Patient Most recent Medications:\n';
            recentMedications.forEach((medication, index) => {
                medicationsMessage += `${index + 1}. Illness: ${medication.illness} - Medication:  ${medication.medicationName } dosage:  ${medication.dosage}\n`;
            });

            // If no allergies are found
            if (recentMedications.length === 0) {
                medicationsMessage = 'No Medication found for this patient.';
            }

            menu.con(medicationsMessage + '\n44: Add a new Medication \n00: Home');
            console.log("Accessing patient data...");

        }
    },
    next: {
        // Return to the account data screen or handle navigation
        //console.log("hell")
        '00': 'showAccountData',
        '44': 'enterNewMedicationData'
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
        //console.log(menu.args.phoneNumber)

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
        console.log(menu.args.phoneNumber)

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

//doctor  navigation states ..
menu.state('verifyDoctorAccess', {
    run: async () => {
        // use menu.con() to send response without terminating session      
        menu.con('Enter the patient phone to continue. +254..');
            
    },
    // next object links to next state based on user input
    next: {

         '*\\d+': 'sendOTPToPatient'
 
    }
});

menu.state('sendOTPToPatient', {
    run: async () => {
        let patientPhoneNumber = menu.val;
        //remove the "+" in phone to compile with cradlevoices sms
        let patientPhoneNumber1 = menu.val.substring(1); 

        let randomOTP = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
        
        // Save the patient's phone number and OTP in the session
        menu.session.set('patientPhoneNumber', patientPhoneNumber);
        menu.session.set('patientOTP', randomOTP);
        
        // Prepare the payload for the SMS API call
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const raw = JSON.stringify({
            "token": "d4dc56547ed09d37721615760ca884a98c1a261389efda59332ee5a35f49f5d5", // Add your actual token
            "message": `Your OTP is ${randomOTP} share it with the doctor`,
            "phone": [
                patientPhoneNumber1
            ]
        });
        
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            //redirect: "follow"
        };
        
        // Send OTP via SMS API
        fetch("https://merchant.cradlevoices.com/", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log("OTP sent successfully:", result);
                // After sending the OTP, prompt the user to enter the OTP
                menu.con('Enter the OTP sent to the patient:');
            })
            .catch((error) => {
                console.error("Error sending OTP:", error);
                menu.con('Failed to send OTP. Please try again.\n00: Home');
            });
    },
    next: {
        '*\\d+': 'veryfyOTP' // Navigate to OTP verification after sending OTP
    }
});


//veryfy the otp sent to the patient ..
menu.state('veryfyOTP', {
    run: async () => {
        // use menu.con() to send response without terminating session   
        console.log(menu.session.get('patientPhoneNumber'));
        let patientOTP  = await menu.session.get('patientOTP');
        let enterdOTP   = menu.val;
        if(patientOTP == enterdOTP){
            //menu.con('access granted');
            menu.con('Access granted' +
                '\n1. Continue' +
                '\n2. Exit');
        }else{
            menu.end('access incorrect otp ');
        }
        
            
    },
    // next object links to next state based on user input
    next: {
        '1': 'showAccountData',
        '2': 'Exit',
    }
});

//doctor entry method 
// nesting states 
// ask for the illness name
menu.state('enterNewMedicationData', {
    run: () => {
        // use menu.val to access user input value
        
        // buyAirtime(menu.args.phoneNumber, amount).then(function(res){
        menu.con('Enter the illness name');
        // });
    },
    next: {
        '*[a-zA-Z]+': 'medication.illnessname'
    }
});
// save the illness name and ask for the  
// ask for the illness name
menu.state('medication.illnessname', {
    run: () => {
        // use menu.val to access user input value
        //save the illness name to the session 
        menu.session.set('illnessName',  menu.val);
        //illness, medication, dossage
        
        // buyAirtime(menu.args.phoneNumber, amount).then(function(res){
        menu.con('Give a medication name');
        // });
    },
    next: {
        '*[a-zA-Z]+': 'medication.medicationName'
    }
});

// ask for the medication name
menu.state('medication.medicationName', {
    run: () => {
        // use menu.val to access user input value
        //save the illness name to the session 
        menu.session.set('medicationName',  menu.val);
        //illness, medication, dossage
        
        // buyAirtime(menu.args.phoneNumber, amount).then(function(res){
        menu.con('Give a Dosage');
        // });
    },
    next: {
        '*[a-zA-Z]+': 'medication.dosage'
    }
});
//give a dosage 
// ask for the medication name
menu.state('medication.dosage', {
    run: () => {
        // use menu.val to access user input value
        //save the illness name to the session 
        menu.session.set('medicationDosage',  menu.val);
        //illness, medication, dossage
        
        // buyAirtime(menu.args.phoneNumber, amount).then(function(res){
            menu.con('Issue medication ' +
                '\n1. Yes' +
                '\n2. No');
        // });
    },
    next: {
        '1': 'medication.issue',
        '2': 'medication.decline'
    }
});

//issue
// nesting states
menu.state('medication.issue', {
    run: async () => {
        const accounts = await web3.eth.getAccounts();  // Fetch available accounts
        const defaultAccount = accounts[0];
        // use menu.val to access user input value
        // get medication issue plus user id 
        let illness      = await menu.session.get("illnessName");
        let medication   = await menu.session.get("medicationName");
        let dossage      = await menu.session.get("medicationDosage");
        let patientPhone = await menu.session.get("patientPhoneNumber");
        //get the patient id
    //    let patientID     =  await getPatientByPhone(menu.session.get('patientPhoneNumber'));
        // console.log(patientPhone);
        let session_data = menu.args.text.split('*');
        let patient = await getPatientByPhone(session_data[1]);
        let patientID = patient['patient']['uuid'];
        let response  = await addMedication(patientID, illness, medication, dossage, 1633024800, 1633636800, defaultAccount);
        console.log(response)
        // console.log(illness);
        // console.log(medication);
        // console.log(dossage);

        // buyAirtime(menu.args.phoneNumber, amount).then(function(res){
        menu.end('Record updated successfully.');
        // });
    }
});
//decline 
menu.state('medication.decline', {
    run: () => {
        // use menu.val to access user input value
        // get medication issue plus user id 
        console.log()
        // buyAirtime(menu.args.phoneNumber, amount).then(function(res){
        menu.end('Medication declined successfully');
        // });
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
