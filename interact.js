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

  

    // Retrieve and display all patients
    try {
        // Define the phone number to search for
        const phoneNumber = "1234567890";
    
        // Get the patient by phone number
        const patient = await myContract.methods.getPatientByPhone(phoneNumber).call();
        console.log("Patient found:", patient);
    
      } catch (error) {
        console.error(error);
      }
    
  
}

interact();
