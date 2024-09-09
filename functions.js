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

// Function to create a new patient
async function createPatient(name, phone, age, account) {
    const uuid = web3.utils.keccak256(uuidv4());
    await myContract.methods.createPatient(uuid, name, phone, age).send({ from: account });
    console.log("Patient created with UUID:", uuid);
    return uuid;
}

// Function to add a test result
async function addTestResult(uuid, testName, result, account) {
    await myContract.methods.addTestResult(uuid, testName, result).send({ from: account });
    console.log(`Test result added: ${testName}, ${result}`);
}

// Function to add vital signs
async function addVitalSign(uuid, signName, signValue, account) {
    await myContract.methods.addVitalSign(uuid, signName, signValue).send({ from: account });
    console.log(`Vital sign added: ${signName}, ${signValue}`);
}

// Function to add medication
async function addMedication(uuid, illness, medication, dosage, startDate, endDate, account) {
    await myContract.methods.addMedication(uuid, illness, medication, dosage, startDate, endDate).send({ from: account });
    console.log(`Medication added: ${medication}, ${dosage}`);
}

// Function to add allergy
async function addAllergy(uuid, allergyName, allergyReaction, account) {
    await myContract.methods.addAllergy(uuid, allergyName, allergyReaction).send({ from: account });
    console.log(`Allergy added: ${allergyName}, ${allergyReaction}`);
}

// Function to add surgery
async function addSurgery(uuid, surgeryName, result, date, account) {
    await myContract.methods.addSurgery(uuid, surgeryName, result, date).send({ from: account });
    console.log(`Surgery added: ${surgeryName}, ${result}`);
}

// Function to add family history
async function addFamilyHistory(uuid, relative, condition, note, account) {
    await myContract.methods.addFamilyHistory(uuid, relative, condition, note).send({ from: account });
    console.log(`Family history added: ${relative}, ${condition}`);
}

// Function to retrieve a patient by phone number
async function getPatientByPhone(phone) {
    const patient = await myContract.methods.getPatientByPhone(phone).call();
    console.log("Patient retrieved by phone:", patient);
    return patient;
}

// Function to retrieve a patient's medical history
async function getPatientMedicalHistory(uuid) {
    const history = await myContract.methods.getPatientMedicalHistory(uuid).call();
    console.log("Patient's medical history:", history);
    return history;
}

module.exports = {
    createPatient,
    addTestResult,
    addVitalSign,
    addMedication,
    addAllergy,
    addSurgery,
    addFamilyHistory,
    getPatientByPhone,
    getPatientMedicalHistory
};
