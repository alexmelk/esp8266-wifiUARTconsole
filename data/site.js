var data = [];
var labels = [];
var ctx;
var chart;
var scaleY = 100;

var maxY = 20;
var minY = -20;

var minTemp;
var maxTemp;

var getUARTdataEv;
var getUARTrawEv;
var stopFlag = false;
var n = 1966;
var scaleX = 100;
function onChangeTrackBarY()
{
	$("#trackBarValueY")[0].innerHTML = $("#trackbarY")[0].value;
	scaleY = $("#trackbarY")[0].value;
	this.updateChart();
}
function onChangeTrackBarX()
{
	$("#trackBarValueX")[0].innerHTML = $("#trackbarX")[0].value;
	scaleX = $("#trackbarX")[0].value;
}
window.onload = async function()
{
	$("#consoleLink")[0].click();

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
	var check = mas.shift();
	if(check == 5000){
	removeData();
	for(let i = 0; i < (mas.length/100)*scaleX; i++)
	{
		data.push((mas[i]-n)/18.68);
		labels.push(i);
	}
	
	console.log(mas);
	chart.update();
}
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
				label: 'Graph',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: data,
				fill: false,
			}],
		},options: {
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Counter'
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Value'
					},
					ticks:
					{
						min:(this.minY/100)*scaleY,
						max:(this.maxY/100)*scaleY,
						stepSize:(Math.abs((this.minY/100)*scaleY)+Math.abs((this.maxY/100)*scaleY))/10
					}
				}]
			}
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