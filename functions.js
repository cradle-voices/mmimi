const { Web3 } = require("web3");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");

const web3 = new Web3("http://127.0.0.1:8545/");
const deployedAddressPath = path.join(__dirname, "MyContractAddress.txt");
const deployedAddress = fs.readFileSync(deployedAddressPath, "utf8");
const abi = require("./MyContractAbi.json");
const myContract = new web3.eth.Contract(abi, deployedAddress);
myContract.handleRevert = true;

// Function to create a new patient and return JSON
async function createPatient(name, phone, age, account) {
    try {
        const uuid = web3.utils.keccak256(uuidv4());
        await myContract.methods.createPatient(uuid, name, phone, age).send({ from: account });
        return { status: "success", uuid: uuid };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to add a test result and return JSON
async function addTestResult(uuid, testName, result, account) {
    try {
        await myContract.methods.addTestResult(uuid, testName, result).send({ from: account });
        return { status: "success", testName: testName, result: result };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to add vital signs and return JSON
async function addVitalSign(uuid, signName, signValue, account) {
    try {
        await myContract.methods.addVitalSign(uuid, signName, signValue).send({ from: account });
        return { status: "success", signName: signName, signValue: signValue };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to add medication and return JSON
async function addMedication(uuid, illness, medication, dosage, startDate, endDate, account) {
    try {
        await myContract.methods.addMedication(uuid, illness, medication, dosage, startDate, endDate).send({ from: account });
        return { status: "success", medication: medication, dosage: dosage };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to add allergy and return JSON
async function addAllergy(uuid, allergyName, allergyReaction, account) {
    try {
        await myContract.methods.addAllergy(uuid, allergyName, allergyReaction).send({ from: account });
        return { status: "success", allergyName: allergyName, allergyReaction: allergyReaction };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to add surgery and return JSON
async function addSurgery(uuid, surgeryName, result, date, account) {
    try {
        await myContract.methods.addSurgery(uuid, surgeryName, result, date).send({ from: account });
        return { status: "success", surgeryName: surgeryName, result: result };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to add family history and return JSON
async function addFamilyHistory(uuid, relative, condition, note, account) {
    try {
        await myContract.methods.addFamilyHistory(uuid, relative, condition, note).send({ from: account });
        return { status: "success", relative: relative, condition: condition };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to retrieve a patient by phone number and return JSON
async function getPatientByPhone(phone) {
    try {
        const patient = await myContract.methods.getPatientByPhone(phone).call();
        return { status: "success", patient: patient };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to retrieve a patient's medical history and return JSON
async function getPatientMedicalHistory(uuid) {
    try {
        const history = await myContract.methods.getPatientMedicalHistory(uuid).call();
        return { status: "success", medicalHistory: history };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

// Function to get all patients and return JSON
async function getAllThePatients() {
    try {
        const patients = await myContract.methods.listAllPatients().call();
        return { status: "success", patients: patients };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

module.exports = {
    createPatient,
    addTestResult,
    addVitalSign,
    getAllThePatients,
    addMedication,
    addAllergy,
    addSurgery,
    addFamilyHistory,
    getPatientByPhone,
    getPatientMedicalHistory
};
