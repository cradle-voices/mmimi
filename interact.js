const { Web3 } = require("web3");

const { createPatient, addTestResult, addVitalSign, addMedication, addAllergy, addSurgery, addFamilyHistory, getPatientByPhone, getPatientMedicalHistory,getAllThePatients } = require('./functions');
const { response } = require("express");

// Initialize Web3 instance
const web3 = new Web3("http://127.0.0.1:8545/");


async function interact() { 
    try {
        const accounts = await web3.eth.getAccounts();  // Fetch available accounts
        const defaultAccount = accounts[0];
        patients = await getPatientByPhone("254794940160");
        //get patinet tby phone 
        // console.log(patients['patient']['uuid']);
        console.log(patients['patient']['medicalHistory']);

        //add a new allergy 
    //    const  response = await addAllergy(patients['patient']['uuid'], "Dairy Allergy", " Hives, swelling of the lips or tongue, vomiting, diarrhea, wheezing, difficulty", defaultAccount);
        // console.log(response);

       
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Run the interaction
interact();
