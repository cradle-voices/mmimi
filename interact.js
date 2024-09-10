const { Web3 } = require("web3");

const { createPatient, addTestResult, addVitalSign, addMedication, addAllergy, addSurgery, addFamilyHistory, getPatientByPhone, getPatientMedicalHistory,getAllThePatients } = require('./functions');
const { response } = require("express");

// Initialize Web3 instance
const web3 = new Web3("http://127.0.0.1:8545/");


async function interact() { 
    try {
        const accounts = await web3.eth.getAccounts();  // Fetch available accounts
        const defaultAccount = accounts[0];
       // const patientUUID = await createPatient("Brian Oduor", "+254768899729", 10, defaultAccount);

        // Add test result
    //     await addTestResult("0xcecc17d5b5b03a159ea0bdc375110626e1a63a019f2799f255e0d5b47b1cbca1", "Covid", "Positiive", defaultAccount);

    //     // Add vital signs
    //    // await addVitalSign("0xcecc17d5b5b03a159ea0bdc375110626e1a63a019f2799f255e0d5b47b1cbca1", "Blood Pressure", "121/80", defaultAccount);

    //     // Add medication
    //     await addMedication("0xcecc17d5b5b03a159ea0bdc375110626e1a63a019f2799f255e0d5b47b1cbca1", "Asthma", "Albuterol", "2.5mg", 1633024800, 1633636800, defaultAccount);

    //     // Add allergy
    //     await addAllergy("0xcecc17d5b5b03a159ea0bdc375110626e1a63a019f2799f255e0d5b47b1cbca1", "Protein", "Anaphylaxis", defaultAccount);

    //     // Add surgery
    //     await addSurgery("0xcecc17d5b5b03a159ea0bdc375110626e1a63a019f2799f255e0d5b47b1cbca1", "Knee", "Successful", 1633024800, defaultAccount);

    //     // Add family history
    //     // await addFamilyHistory("0xcecc17d5b5b03a159ea0bdc375110626e1a63a019f2799f255e0d5b47b1cbca1", "Father", "Heart Disease", "Had surgery at 63", defaultAccount);

    //     // Retrieve patient by phone
    //     await getPatientByPhone("+254768899729");

        // Retrieve patient's medical history
       let  response = await getAllThePatients();

        console.log(response);
        

       
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Run the interaction
interact();
