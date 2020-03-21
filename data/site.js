var data = [];
var labels = [];
var ctx;
var chart;
var maxY = 26;
var minY = 0;
var minTemp;
var maxTemp;

var getUARTdataEv;
var getUARTrawEv;
var stopFlag = false;
var n = 1966;

window.onload = async function()
{
	//append setting container
	//let response = await fetch("/settings");
	//var t = await response.text();
	//console.log(t);
	//$("#settingsContainer").append(t);
	
	//append wifiNetwork container
	//response = await fetch("/getWifiList");
	//t = await response.text();
	//console.log(t);
	//$("#inputGroupSelect01").empty();
	//$("#inputGroupSelect01").append(t);
	//var wifilist = setInterval(await getWiFiList,60000);
	//setInterval(await getDevicesList,60000);
	//setInterval(await getNotifi,40000);
	getUARTdataEv = setInterval(await getUARTdata,1000);

	$("#sendToUART").on("click",function(){
		let data = $("#usersMess").val();
		fetch("/sendDataToUART?UARTdata="+data);
		let text = "<h6 class='codeText'>Вы:["+moment().format("HH:mm")+"] "+ data + "</h6>";
		$("#containerNotifi").append(text)
	});
	
	$("#serialSpeed").on("change",function(){
		let data = $("#serialSpeed").val();
		fetch("/configUART?UARTspeed="+data);
	})

	this.updateChart();

}

async function getUARTdata()
{
	let response = await fetch("/getUARTdata");
	let t = await response.text();
	console.log(t);
	if(t){$("#containerNotifi").append(t)};

	let mas = t.match(/\d\d+/g);
	removeData();
	mas.shift();
	for(let i = 0; i < mas.length; i++)
	{
		data.push((mas[i]-n)/18.68);
		labels.push(i);
	}
	
	console.log(mas);
	chart.update();
}

function updateChart()
{

	ctx = document.getElementById('myChart').getContext('2d');
	chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',
		
		// The data for our dataset
		data: {
			labels: labels,
			datasets: [{
				label: 'График',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: data,
				fill: false,
			}],
		}
	});
}
async function toogle(element)
{
	console.log(element)
	if($("#"+element.id).hasClass("btn-danger"))//остановлено
	{
		$("#"+element.id)[0].innerText = "Останов.";
		$("#"+element.id).removeClass("btn-danger");
		$("#"+element.id).addClass("btn-primary");
		getUARTdataEv = setInterval(getUARTdata,1000);
	}
	else
	{
		$("#"+element.id)[0].innerText = "Пуск";
		$("#"+element.id).removeClass("btn-primary");
		$("#"+element.id).addClass("btn-danger");
		clearInterval(getUARTdataEv);
	}
}
function removeData() {
	while(data.length){
		data.pop();
		labels.pop();
	}
    chart.update();
}