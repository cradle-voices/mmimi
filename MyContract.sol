// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    

    struct Patient {
        bytes32 uuid;
        string name;
        string phone;
        uint age;
    }

    Patient[] public patients;

    // Function to create a new patient using a UUID
    function createPatient(bytes32 _uuid, string memory _name, string memory _phone, uint _age) public {
        patients.push(Patient({
            uuid: _uuid,
            name: _name,
            phone: _phone,
            age: _age
        }));
    }

    // Function to list all patients
    function listAllPatients() public view returns (Patient[] memory) {
        return patients;
    }

    // Function to get patient by UUID
    function getPatientByUUID(bytes32 _uuid) public view returns (Patient memory) {
        for (uint i = 0; i < patients.length; i++) {
            if (patients[i].uuid == _uuid) {
                return patients[i];
            }
        }
        revert("Patient not found");
    }
}
