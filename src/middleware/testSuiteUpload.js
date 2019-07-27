import XLSX from 'xlsx';
import { testSuiteFileUploadSuccess, testSuiteSheetloadSuccess } from '../actions';

let pages = [];
let workbook = {};
let testSuiteFile = null;
let selectedSheet = null;
let suiteName = '';
// let selectedTestCases = [];

const show=false;
const show1=true;

let temp_db_detailarr = []
let temp_table_detail = [];
let temp_column_detail = [];
let all_cases = [];

const headers = {
	'Accept': 'application/json, text/plain, */*',
	'Content-Type': 'application/json',
	'Authorization':''
};

const getPostFilePayloadData = (fileToUpload, selectedSheet, selectedCase, suiteName, executeValue) => {
	const payload = {
		'inputFile': fileToUpload,
		'sheet': selectedSheet,
		'selectedcase': selectedCase,
		'suitename': suiteName,
		'exvalue': executeValue
	}
	return payload;
};

export const loadTestSuiteFile = (selectedFiles) => dispatch => {
	console.log('loadTestSuiteFile ', selectedFiles);
	// handleChange(sheets);
	const file = selectedFiles[0];
	const fileReader = new FileReader();

	fileReader.onload = (evt) => {
		const arrayBuffer = fileReader.result;
		const data = new Uint8Array(arrayBuffer);
		const arr = [];

		for (let i = 0; i !== data.length; ++i) {
			arr[i] = String.fromCharCode(data[i]);
		}
		
		const bstr = arr.join("");
		workbook = XLSX.read(bstr, {type:"binary"});

		if (typeof pages !== 'undefined' && pages.length > 0) {
			pages = [];
		}

		for ( let x=0; x!==data.length; x++) {
			if (!workbook.SheetNames[x]) {
				break;
			} else {
				pages.push(workbook.SheetNames[x]);
			}
		}
		console.log('pages===>', pages);

		dispatch(testSuiteFileUploadSuccess(pages));
	};

	testSuiteFile = file;
	fileReader.readAsArrayBuffer(file);
	// console.log('loadTestSuiteFile temp_db_detailarr==', temp_db_detailarr);
	// console.log('loadTestSuiteFile all_cases==', all_cases);
};

export const loadTestSuiteSheet = (page) => dispatch => {
	console.log('loadTestSuiteSheet ', page);
	selectedSheet = page;
	const index = pages.findIndex(page_p=>page_p===page);
	const sheetName = workbook.SheetNames[index];
	const sheet = workbook.Sheets[sheetName];
	const resfinal = (XLSX.utils.sheet_to_json(sheet, {raw:true}));
	
	temp_db_detailarr = []
	temp_table_detail = [];
	temp_column_detail = [];
	all_cases = [];

	for (let i=0; i<resfinal.length; i++)
	{
		temp_db_detailarr.push(resfinal[i]['DB Details']); //TO DO:HARD CODED.['Test Class']
		all_cases.push({'id':i,'name':resfinal[i]['Test Class'],'selected':false, 'description':resfinal[i]['Description']});
		temp_table_detail.push(resfinal[i]['Source Table:Target Table']);
		temp_column_detail.push(resfinal[i]['Columns']);
	}

	dispatch(testSuiteSheetloadSuccess({dbDetailsList: temp_db_detailarr, allCases: all_cases }));

	// below func validate the 1st column all row
	// console.log('temp_db_detailarr==', temp_db_detailarr);
	// console.log('all_cases==', all_cases);

	//    if(!this.validate_case_name(this.all_cases)){
	// 	 console.log("2")
	// 	 this.clearAll("Filecannot be Uploaded, Case name is not Valid")
	// 	 return;
	//    }
	//    //below func validate db details
	//    if(!this.validate_db_detail(this.temp_db_detailarr)){
	// 	   this.clearAll("filecannot be uploaded, db details are not valid")
	// 	   return;
	//    }
	//    // below func to validate table name
	//   if(!this.validate_table_names(this.temp_table_detail)){
	// 	   this.clearAll("filecannot be uploaded, Table Names are not valid")
	// 	   return;
	//   }
	//  prog=75; 

	//  const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {   
	//    width: '250px',
	//    data : {suitename :this.suitename}
	   
	//  });
	//  dialogRef.afterClosed().subscribe(result => {
	//   this.suitename = result
	//  });
};

export const uploadTestCases = (selectedTestCases, mode) => dispatch => {
	console.log('uploadTestCases ==', selectedTestCases);
	console.log(this.suitename);
	this.spinnerService.show();
	// this.MyModel=null;
	// this.show=false;
	// this.show1=false;

	 // v value specifies to upload or upload+execute
	//  if (mode == 0) {
	// 	 // upload only
	//    this.executevalue = 0
	//  }else{
	// 	 // upload and execute
	//    this.executevalue = 1
	//  }

	const executeValue = (mode == 0)? 0: 1;
	// this.changessaved=true;

	 // tmp Code. Will change after sheet rename file popup dialog
	suiteName = selectedSheet;
	 
	// this.fileUploadService.postFile(testSuiteFile, selectedSheet, selectedTestCases, suitename, executevalue).subscribe(data => {
		// this.name=data['message']
		// this.filevalue=null;
		// this.disable=true;
		// this.disable2=true;
		// Swal("Success","Succesfully Uploaded Quality Suite","success")
		// this.all_cases=[];
		// this.initialisecases();
		// this.response=this.name;
		// this.router.navigate(['/startup'])
		// this.selectedValue=[]
		// this.spinnerService.hide();
	//   }, error => {
		// this.spinnerService.hide();
  		// Swal("error"," filecannot be uploaded","error")
		// this.filevalue=null;
		// this.all_cases=[];    
		// this.initialisecases();
	//   });

	const body = getPostFilePayloadData(testSuiteFile, selectedSheet, selectedTestCases, suiteName, executeValue);
	fetch(`${BASE_URL}/test-suite`, {
		method: 'post',
		headers,
		body
	})
		.then(res => res.json())
		.then(res => {
			if(res.error) {
				dispatch(uploadTestCasesError(res.error));
			}
			dispatch(uploadTestCasesSuccess(res.data));
		})
		.catch(error => {
			dispatch(uploadTestCasesError(error));
		});
}

// postFile(fileToUpload: File,selectedsheet:any,selectedCase:any,suitename:any,executevalue:any):Observable<any>{
//     console.log("came in service")
//     const upload=new FormData()
//     upload.append('inputFile',fileToUpload)
//     upload.append('sheet',selectedsheet)
//     upload.append('selectedcase',selectedCase)
//     upload.append('suitename',suitename)
//     upload.append('exvalue',executevalue)
//     this.loadToken()
//     this.newtoken='Bearer'+" "+this.authToken
//     let headers = new HttpHeaders().set('Authorization',this.newtoken)
//     return this.http.post<any>(`${this.url}/test-suite`,upload,{headers: headers}); 
//   }

export const selectAllTestCases = (page) => dispatch => {
	
};