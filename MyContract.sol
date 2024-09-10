// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {

    struct Patient {
        bytes32 uuid;
        string name;
        string phone;
        uint age;
        MedicalHistory medicalHistory;
    }

    struct MedicalHistory {
        Test[] tests;
        VitalSign[] vitalSigns;
        Medication[] medications;
        Allergy[] allergies;
        Surgery[] surgeries;
        FamilyHistory[] familyHistories;
    }

    struct Test {
        string testName;
        string result;
        uint timestamp;
    }

    struct VitalSign {
        string vitalName;
        string value;
        uint timestamp;
    }

    struct Medication {
        string illness;
        string medicationName;
        string dosage;
        uint startDate;
        uint endDate;
    }

    struct Allergy {
        string allergen;
        string reaction;
        uint timestamp;
    }

    struct Surgery {
        string surgeryType;
        string outcome;
        uint date;
    }

    struct FamilyHistory {
        string relation;
        string condition;
        string details;
    }

    mapping(bytes32 => Patient) private patientsByUUID;
    mapping(string => bytes32) private patientPhoneToUUID;  // Map phone to UUID for easy lookup
    bytes32[] private patientList;

    /*----------------------- Patient Management --------------------------*/

    // Function to create a new patient using a UUID
    function createPatient(bytes32 _uuid, string memory _name, string memory _phone, uint _age) public {
        require(patientPhoneToUUID[_phone] == 0, "Patient already exists");
        
        Patient storage patient = patientsByUUID[_uuid];
        patient.uuid = _uuid;
        patient.name = _name;
        patient.phone = _phone;
        patient.age = _age;

        patientPhoneToUUID[_phone] = _uuid;
        patientList.push(_uuid);
    }

    // Function to get patient by UUID
    function getPatientByUUID(bytes32 _uuid) public view returns (Patient memory) {
        require(patientsByUUID[_uuid].uuid != 0, "Patient not found");
        return patientsByUUID[_uuid];
    }

    // Function to get patient by phone number
    function getPatientByPhone(string memory _phone) public view returns (Patient memory) {
        bytes32 uuid = patientPhoneToUUID[_phone];
        return getPatientByUUID(uuid);
    }

    // Function to list all patients
    function listAllPatients() public view returns (Patient[] memory) {
        Patient[] memory allPatients = new Patient[](patientList.length);
        for (uint i = 0; i < patientList.length; i++) {
            allPatients[i] = patientsByUUID[patientList[i]];
        }
        return allPatients;
    }

    /*----------------------- Medical Records Management --------------------------*/

    // Add test result to patient history
    function addTestResult(bytes32 _uuid, string memory _testName, string memory _result) public {
        require(patientsByUUID[_uuid].uuid != 0, "Patient not found");
        Test memory newTest = Test(_testName, _result, block.timestamp);
        patientsByUUID[_uuid].medicalHistory.tests.push(newTest);
    }

    // Add vital sign to patient history
    function addVitalSign(bytes32 _uuid, string memory _vitalName, string memory _value) public {
        require(patientsByUUID[_uuid].uuid != 0, "Patient not found");
        VitalSign memory newVitalSign = VitalSign(_vitalName, _value, block.timestamp);
        patientsByUUID[_uuid].medicalHistory.vitalSigns.push(newVitalSign);
    }

    // Add medication to patient history
    function addMedication(bytes32 _uuid, string memory _illness, string memory _medicationName, string memory _dosage, uint _startDate, uint _endDate) public {
        require(patientsByUUID[_uuid].uuid != 0, "Patient not found");
        Medication memory newMedication = Medication(_illness, _medicationName, _dosage, _startDate, _endDate);
        patientsByUUID[_uuid].medicalHistory.medications.push(newMedication);
    }

    // Add allergy to patient history
    function addAllergy(bytes32 _uuid, string memory _allergen, string memory _reaction) public {
        require(patientsByUUID[_uuid].uuid != 0, "Patient not found");
        Allergy memory newAllergy = Allergy(_allergen, _reaction, block.timestamp);
        patientsByUUID[_uuid].medicalHistory.allergies.push(newAllergy);
    }

    // Add surgery to patient history
    function addSurgery(bytes32 _uuid, string memory _surgeryType, string memory _outcome, uint _date) public {
        require(patientsByUUID[_uuid].uuid != 0, "Patient not found");
        Surgery memory newSurgery = Surgery(_surgeryType, _outcome, _date);
        patientsByUUID[_uuid].medicalHistory.surgeries.push(newSurgery);
    }

    // Add family history to patient history
    function addFamilyHistory(bytes32 _uuid, string memory _relation, string memory _condition, string memory _details) public {
        require(patientsByUUID[_uuid].uuid != 0, "Patient not found");
        FamilyHistory memory newFamilyHistory = FamilyHistory(_relation, _condition, _details);
        patientsByUUID[_uuid].medicalHistory.familyHistories.push(newFamilyHistory);
    }

    // Function to view patient's medical history
    function getPatientMedicalHistory(bytes32 _uuid) public view returns (MedicalHistory memory) {
        require(patientsByUUID[_uuid].uuid != 0, "Patient not found");
        return patientsByUUID[_uuid].medicalHistory;
    }
}
