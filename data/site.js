
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
	
	setInterval(await getUARTdata,1000);
	//setInterval(await getDevicesList,60000);
	//setInterval(await getNotifi,40000);


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



}

async function getUARTdata()
{
	response = await fetch("/getUARTdata");
	t = await response.text();
	console.log(t);
	if(t){$("#containerNotifi").append(t)};
}
