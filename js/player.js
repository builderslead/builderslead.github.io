// var stepped = 0, chunks = 0, rows = 0;
// var start, end;
// var parser;
// var pauseChecked = false;
// var printStepChecked = false;
var uploadedLeads = {};
var balanceLeads = 0;
var campaignId = "";
var uEmail = "";
$campaignBlock = $(this);
var finalLeadsData = [];


function parseTest(cId, bleads, email) {
	console.log(cId, bleads, email);
	campaignId = cId;
	balanceLeads = bleads;
	uEmail = email;
}

function parseLeadsCSV() {
	$campaignBlock = $(this);
	// console.log($($campaignBlock[0].previousElementSibling)[0].files)
	// console.log($($(this)[0].previousElementSibling)[0].files);
	// $($(this)[0].nextElementSibling)[0].innerHTML = "Something";
	// console.log($($(this)[0].nextElementSibling)[0].innerHTML);
	// stepped = 0;
	// chunks = 0;
	// rows = 0;

	// var txt = $('#input').val();
	// var localChunkSize = $('#localChunkSize').val();
	// var remoteChunkSize = $('#remoteChunkSize').val();
	var files = $($(this)[0].previousElementSibling)[0].files;
	var config = buildConfig($campaignBlock);

	// NOTE: Chunk size does not get reset if changed and then set back to empty/default value
	// if (localChunkSize)
	// 	Papa.LocalChunkSize = localChunkSize;
	// if (remoteChunkSize)
	// 	Papa.RemoteChunkSize = remoteChunkSize;

	// pauseChecked = $('#step-pause').prop('checked');
	// printStepChecked = $('#print-steps').prop('checked');


	if (files.length > 0) {
		// if (!$('#stream').prop('checked') && !$('#chunk').prop('checked'))
		// {
		// 	for (var i = 0; i < files.length; i++)
		// 	{
		// 		if (files[i].size > 1024 * 1024 * 10)
		// 		{
		// 			alert("A file you've selected is larger than 10 MB; please choose to stream or chunk the input to prevent the browser from crashing.");
		// 			return;
		// 		}
		// 	}
		// }

		Papa.parse(files[0], config);

		// start = performance.now();

		// $('#files').parse({
		// 	config: config,
		// 	before: function(file, inputElem)
		// 	{
		// 		console.log("Parsing file:", file);
		// 	},
		// 	complete: function(results)
		// 	{
		// 		console.log("Done with all files." , results);
		// 	}
		// });
	}
	// else
	// {
	// 	start = performance.now();
	// 	var results = Papa.parse(txt, config);
	// 	console.log("Synchronous parse results:", results);
	// }
};

// $('#submit-unparse').click(function()
// {
// 	var input = $('#input').val();
// 	var delim = $('#delimiter').val();
// 	var header = $('#header').prop('checked');

// 	var results = Papa.unparse(input, {
// 		delimiter: delim,
// 		header: header,
// 	});

// 	console.log("Unparse complete!");
// 	console.log("--------------------------------------");
// 	console.log(results);
// 	console.log("--------------------------------------");
// });

// $('#insert-tab').click(function()
// {
// 	$('#delimiter').val('\t');
// });



function buildConfig() {
	return {
		// delimiter: $('#delimiter').val(),
		// newline: getLineEnding(),
		header: true,
		// dynamicTyping: $('#dynamicTyping').prop('checked'),
		// preview: parseInt($('#preview').val() || 0),
		// step: $('#stream').prop('checked') ? stepFn : undefined,
		// encoding: $('#encoding').val(),
		// worker: $('#worker').prop('checked'),
		// comments: $('#comments').val(),
		complete: parseComplete,
		error: errorFn,
		// download: $('#download').prop('checked'),
		// fastMode: $('#fastmode').prop('checked'),
		// skipEmptyLines: $('#skipEmptyLines').prop('checked'),
		// chunk: $('#chunk').prop('checked') ? chunkFn : undefined,
		// beforeFirstChunk: undefined,
	};

	// function getLineEnding()
	// {
	// 	if ($('#newline-n').is(':checked'))
	// 		return "\n";
	// 	else if ($('#newline-r').is(':checked'))
	// 		return "\r";
	// 	else if ($('#newline-rn').is(':checked'))
	// 		return "\r\n";
	// 	else
	// 		return "";
	// }
}

// function stepFn(results, parserHandle)
// {
// 	stepped++;
// 	rows += results.data.length;

// 	parser = parserHandle;

// 	if (pauseChecked)
// 	{
// 		console.log(results, results.data[0]);
// 		parserHandle.pause();
// 		return;
// 	}

// 	if (printStepChecked)
// 		console.log(results, results.data[0]);
// }

// function chunkFn(results, streamer, file)
// {
// 	if (!results)
// 		return;
// 	chunks++;
// 	rows += results.data.length;

// 	parser = streamer;

// 	if (printStepChecked)
// 		console.log("Chunk data:", results.data.length, results);

// 	if (pauseChecked)
// 	{
// 		console.log("Pausing; " + results.data.length + " rows in chunk; file:", file);
// 		streamer.pause();
// 		return;
// 	}
// }

function errorFn(error, file) {
	console.log("ERROR:", error, file);
}

function parseComplete(results, file) {
	let uLeadsData = "";
	console.log("Parsing complete:", results, file);
	uploadedLeads = results.data;
	if (uploadedLeads.length > balanceLeads) {
		$($campaignBlock[0].nextElementSibling)[0].innerHTML = '<div class="bla_leadupload_err">You have uploaded ' + uploadedLeads.length + ' leads, which is more than the remaining leads. Please upload only the remaining number of leads or less.</div>';
	} else {
		finalLeadsData = results.data;
		results.data.forEach(leadUploadResult => {
			uLeadsData = uLeadsData + '<tr> <td>' + leadUploadResult.email + '</td> <td>' + leadUploadResult.full_name + '</td> <td>' + leadUploadResult.phone_number + '</td> <td>' + leadUploadResult.extra_details + '</td> </tr>';
		});
		let uLeadsBody = '<tbody>' + uLeadsData + '</tbody>';
		let uLeadsTable = '<table class="dflex bla_uleads_table"><thead><tr> <th>Email</th> <th>Full Name</th> <th>Phone</th> <th>Extra Info</th> </tr></thead>' + uLeadsBody + '</table>' +
			'<div class="dflex bla_leadupload_msg">You have uploaded a total of ' + uploadedLeads.length + ' leads for this campaign.</div>' +
			'<div class="dflex bla_leadupload_confirm"><div class="bla_leadupload_confirm1">Are the above leads correct?</div><button class="btn waves-effect waves-light" type="submit" name="action" onclick="disablebBtn.call(this); addVerifiedLeads();">CONFIRM <i class="material-icons right">send</i> </button></div>';
		$($campaignBlock[0].nextElementSibling)[0].innerHTML = uLeadsTable;
	}
}

function completeFn() {
	end = performance.now();

	rows = arguments[0].data.length;
	resultjson = arguments[0].data;

	console.log("Finished input (async). Time:", end - start, arguments);
	console.log("output JSON:", resultjson);
	console.log("Rows:", rows, "Stepped:", stepped, "Chunks:", chunks);
}

function disablebBtn() {
	$(this).attr("disabled", "disabled");
	$(this).addClass("pulse");
	console.log($(this));
}

function addVerifiedLeads() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(xhttp.responseText);
			console.log(response);
			getCampaignDetails(uEmail);
		}
	};
	xhttp.open("POST", "https://builderjoe.pythonanywhere.com/createLeads", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("leadsObject=" + JSON.stringify(finalLeadsData) + "&campaignId=" + campaignId);
}