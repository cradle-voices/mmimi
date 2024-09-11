const { Web3 } = require("web3");

const { createPatient, addTestResult, addVitalSign, addMedication, addAllergy, addSurgery, addFamilyHistory, getPatientByPhone, getPatientMedicalHistory,getAllThePatients } = require('./functions');
const { response } = require("express");


// TEST OUR CONTRACT SEE IT ALL IS WORIING 

// Initialize Web3 instance
const web3 = new Web3("http://127.0.0.1:8545/");


async function interact() { 
    try {
        const accounts = await web3.eth.getAccounts();  // Fetch available accounts
        const defaultAccount = accounts[0];
        let  response = await getAllThePatients();
        console.log(response);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Run the interaction
interact();
