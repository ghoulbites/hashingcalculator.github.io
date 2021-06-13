let tableType = "1";
let resolutionMethod = "1";
let linearProbeMultiplier = 1;
let quadraticProbeMultiplier = 1;
let tableSize = 7;
const DEBUG_MAX_SIZE = 53;
let key = 2;
let Hash_Function_String = "(5 - (k * 2)) + 3 / 3 % s";
let Double_Hash_String = "5 - 2";
const TABLE_DATA_TYPES = ["Int", "Float", "Double", "Char", "String"];
const CONFLICT_RESOLUTION_METHODS = ["Separate", "Linear", "Quadratic", "Double Hash"];

// Bootstrap garbage to allow tooltips for <input> element
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

let HashTable = {
	table: [],
	size: tableSize,
	count: 0,
	loadFactor: this.count / this.size
};

const AllContainers = document.querySelectorAll("div");
const AllInputs = document.querySelectorAll("input");
const AllButtons = document.querySelectorAll("button");

const TableSizeInput = AllInputs[0];
const DataTypeSelectElement = document.querySelector("select");
const HashFunctionInputElement = AllInputs[1];
const CollisionResolutionOptions = document.querySelector("fieldset");
const LinearProbeInputElement = AllInputs[6];
const QuadraticProbeInput = AllInputs[7];
const DoubleHashInput = AllInputs[8];
const TableDisplay = AllContainers[24];
const EnterKeyButton = AllButtons[0];
const DeleteKeyButton = AllButtons[1];
const EnterKeyInput = AllInputs[9];
const DeleteKeyInput = AllInputs[10];

function ClearTable() {
	TableDisplay.innerHTML = '<div class="row">\
  <span class="text-white">some sample text</span>\
  </div>';
	HashTable.table = [];
}

function InitializeTable() {
	ClearTable();

	if (resolutionMethod == "1") {
		for (let i = 0; i < tableSize; i++) {
			HashTable.table[i] = [];
		}
	} else {
		for (let i = 0; i < tableSize; i++) {
			HashTable.table[i] = undefined;
		}
	}
	return HashTable;
}

function DisplayTable() {
	TableDisplay.innerHTML = "";

	if (resolutionMethod == "1") {
		for (let i = 0; i < tableSize; i++) {
			const TableIndexElementRow = document.createElement("div");
			TableIndexElementRow.classList.add("row");
			TableIndexElementRow.classList.add("py-1");

			const TableIndexElementSpan = document.createElement("span");
			let stringArray = HashTable.table[i].toString();
      stringArray = stringArray.replaceAll(",", ", ")
			TableIndexElementSpan.innerText = "Index " + i + ": [" + stringArray + "]";
			TableIndexElementSpan.classList.add("text-white");

			TableIndexElementRow.appendChild(TableIndexElementSpan);
			TableDisplay.appendChild(TableIndexElementRow);
		}
	} else {
		for (let i = 0; i < tableSize; i++) {
			const TableIndexElementRow = document.createElement("div");
			TableIndexElementRow.classList.add("row");
			TableIndexElementRow.classList.add("py-1");

			const TableIndexElementSpan = document.createElement("span");
			TableIndexElementSpan.innerText = "Index " + i + ": " + HashTable.table[i];
			TableIndexElementSpan.classList.add("text-white");

			TableIndexElementRow.appendChild(TableIndexElementSpan);
			TableDisplay.appendChild(TableIndexElementRow);
		}
	}
}

function CheckFunctionStringValidity(hashString) {
	if (hashString.match(/[^ks+\/%^*\-\d()]/gm) != null) return false;
	return true;
}

function HashFunction() {
	let TempHashString = Hash_Function_String;
	TempHashString = TempHashString.replace("k", key);
	TempHashString = TempHashString.replace("s", tableSize);
	TempHashString = TempHashString.replaceAll(" ", "");

	if (!CheckFunctionStringValidity(TempHashString)) return false;

	//console.log(TempHashString);
	const result = new Function("return " + TempHashString)();
	//console.log(result);
	return result;
}

function LinearProbe(collisions) {
	return linearProbeMultiplier * collisions;
}

function QuadraticProbe(collisions) {
	return quadraticProbeMultiplier * collisions * collisions;
}

function DoubleHashFunction() {
	let TempHashString = Double_Hash_String;
	TempHashString = TempHashString.replace("k", key);
	TempHashString = TempHashString.replace("s", tableSize);
	TempHashString = TempHashString.replaceAll(" ", "");

	if (!CheckFunctionStringValidity(TempHashString)) return false;

	//console.log(Double_Hash_String);
	const result = new Function("return " + TempHashString)();
	//console.log(result);
	return result;
}

function InsertKey() {
	let collisions = 0;
	if (key == "") return;
	let index = null;
	while (index === null || HashTable.table[index] === null) {
		if (resolutionMethod == "1") {
			index = Math.abs(HashFunction()) % tableSize;
			HashTable.table[index].push(key);
			//console.log("Added key " + key + " to index " + index);
      HashTable.count += 1;
			return DisplayTable();
		} else if (resolutionMethod == "2") {
			try {
				index = HashFunction() + LinearProbe(collisions);
				//console.log("Original index: " + index);
				//console.log("Collisions: " + collisions);
				index = Math.abs(HashFunction() + LinearProbe(collisions)) % tableSize;
        HashTable.table[index] = key;
        HashTable.count += 1;
				return DisplayTable();
			} catch (err) {
				return console.log("Error in calculation");
			}
		} else if (resolutionMethod == "3") {
			try {
				index = HashFunction() + QuadraticProbe(collisions);
				//console.log("Original index: " + index);
				//console.log("Collisions: " + collisions);
				index = Math.abs(HashFunction() + QuadraticProbe(collisions)) % tableSize;
        HashTable.table[index] = key;
        HashTable.count += 1;
				return DisplayTable();
			} catch (err) {
				return console.log("Error in calculation");
			}
		} else if (resolutionMethod == "4") {
			try {
				index = Math.abs(HashFunction() + collisions * DoubleHashFunction()) % tableSize;
        HashTable.table[index] = key;
        HashTable.count += 1;
				return DisplayTable();
			} catch (err) {
				return console.log("Error in calculation");
			}
		}
		collisions += 1;
	}
}

function DeleteString() {}

//#region -- Hash Function Set Placeholder, Tooltip Text, and get hash function string
// Check properties of element
// console.dir(HashFunctionInput);

HashFunctionInputElement.placeholder = Hash_Function_String;

// Tooltip Text
HashFunctionInputElement.setAttribute(
	"data-bs-original-title",
	"Use 'k' to symbolise the key, use 's' to symbolise the table size. The operators are: + for addition, - for subtraction, * for multiplication, / for decimal division, % for modulus/remainder. Note that // integer division and ^ powers are not supported yet."
);

HashFunctionInputElement.addEventListener("focusout", (event) => {
	Hash_Function_String = event.target.value;
	//console.log("Hash Function String: " + Hash_Function_String);

	InitializeTable();
	DisplayTable();
});
//#endregion

TableSizeInput.addEventListener("focusout", (event) => {
	tableSize = 7;
	const newTableSize = parseInt(event.target.value);
	if (newTableSize != "" && newTableSize >= 1 && newTableSize <= DEBUG_MAX_SIZE) tableSize = newTableSize;
	//console.log("Table Size: " + tableSize);

	InitializeTable();
	DisplayTable();
});

// Change Table Data Type
DataTypeSelectElement.addEventListener("change", (event) => {
	tableType = event.target.value;
	//console.log("Table Data Type: " + TABLE_DATA_TYPES[tableType - 1]);

	InitializeTable();
	DisplayTable();
});

CollisionResolutionOptions.addEventListener("change", (event) => {
	resolutionMethod = parseInt(event.target.value);
	//console.log("Resolution Method: " + resolutionMethod);

	InitializeTable();
	DisplayTable();
});

LinearProbeInputElement.addEventListener("focusout", (event) => {
	linearProbeMultiplier = 1;
	if (event.target.value != "") linearProbeMultiplier = parseInt(event.target.value);
	//console.log("Linear Probe Multiplier: " + linearProbeMultiplier);

	InitializeTable();
	DisplayTable();
});

QuadraticProbeInput.addEventListener("focusout", (event) => {
	quadraticProbeMultiplier = 1;
	if (event.target.value != "") quadraticProbeMultiplier = parseInt(event.target.value);
	//console.log("Quadratic Probe Multiplier: " + quadraticProbeMultiplier);

	InitializeTable();
	DisplayTable();
});

DoubleHashInput.addEventListener("focusout", (event) => {
	Double_Hash_String = event.target.value;
	//console.log("Double Hash Function String: " + Double_Hash_String);

	InitializeTable();
	DisplayTable();
});

EnterKeyButton.addEventListener("click", () => {
	if (EnterKeyInput != "") key = parseInt(EnterKeyInput.value);
	InsertKey(key);
  EnterKeyInput.value = "";
});

document.addEventListener("DOMContentLoaded", () => {
	InitializeTable();
	DisplayTable();
});
