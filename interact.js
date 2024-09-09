const { Web3 } = require("web3");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const web3 = new Web3("http://127.0.0.1:8545/");

// Read the contract address from the file system
const deployedAddressPath = path.join(__dirname, "MyContractAddress.txt");
const deployedAddress = fs.readFileSync(deployedAddressPath, "utf8");

// Create a new contract object using the ABI and address
const abi = require("./MyContractAbi.json");
const myContract = new web3.eth.Contract(abi, deployedAddress);
myContract.handleRevert = true;

async function interact() {
  const accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];

  try {
    // Hardcode patients' data with UUIDs
    // const patients = [
    //   { uuid: uuidv4().replace(/-/g, ''), name: "John Doe", phone: "1234567890", age: 30 },
    //   { uuid: uuidv4().replace(/-/g, ''), name: "Jane Smith", phone: "0987654321", age: 25 },
    //   { uuid: uuidv4().replace(/-/g, ''), name: "Alice Johnson", phone: "5556667777", age: 40 },
    //   { uuid: uuidv4().replace(/-/g, ''), name: "Bob Williams", phone: "2223334444", age: 35 }
    // ];

    // Add patients to the contract
    // for (const patient of patients) {
    //   const patientReceipt = await myContract.methods
    //     .createPatient(web3.utils.asciiToHex(patient.uuid), patient.name, patient.phone, patient.age)
    //     .send({
    //       from: defaultAccount,
    //       gas: 1000000,
    //       gasPrice: "10000000000",
    //     });
    //   console.log(`Patient ${patient.name} created with UUID: ${patient.uuid}`);
    // }

    // Retrieve and display all patients
    // const allPatients = await myContract.methods.listAllPatients().call();
    // console.log("All Patients:", allPatients);
    
  } catch (error) {
    console.error(error);
  }
}

interact();
