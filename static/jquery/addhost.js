var array_url= [[],[],[],[],[],[],[],[],[]];//默认加载的用户，现设定最大值为9
var array_index1 = 0;
var array_index2 = 0;
//array_url用来存储默认用户的id和name，array_index1,2用来表示array_url的下标
var user_attr_list = new Object(); //没用到
var default_user_attr = new Array();//保存默认5个用户的现有属性
var user_arrt = new Array();//保存用户所有属性
var adduser_or_showuser = "";//来判断按钮是新增还是展示
var new_user = new Object();//保存新增用户的属性
//
//function creat_host_ci(obj){
//	
//    //step1新建主机ci   
//    var step1_hostname = document.getElementById("step1_host_name").value;
//    var step1_description = document.getElementById("step1_description").value;
//    var url = "/ci?name="+ step1_hostname +"&ci_type_fid=FCIT00000001&decription=" + step1_description;
//    array_url.push(url);
//    array_url.push("123");
//    $.post(url,function(data){alert(data);})
//    
//    //step1新建主机ci属性
//    
//    alert(step1_description);
//    //url = "http://192.168.1.3:8080/ciattr?ci_fid=FCID00000072&ci_attrtype_fid=FCAT00000002&value=slave_test_20150714";
//    //$.post(url,function(data){alert (data);})
//    //step1新建主机ci属性
//    
//    
//    
//    //step2新建主机用户(在用户属性里有修改的时候)
//    //1.新建用户ci
//    url = "http://192.168.1.3:8080/ci?name=imonitor&ci_type_fid=FCIT00000007&priority=1000"; //有个优先级
//    //$.post(url,function(data){alert(data);})
//    //2.新建用户下，新建被修改的属性
//    url = http://192.168.1.3:8080/ciattr?ci_fid=对应ci的fid&ci_attrtype_fid=ci属性的faid&value=属性值";
//     //$.post(url,function(data){alert(data);})
//    //3.新建用户 与 step1新建的主机做relation
//    url =" http://192.168.1.3:8080/cirela?source_name="+ source_name + "&target_name=" + target_name ;
//    //4.原有用户 与 step1新建的主机做relation
//    url =" http://192.168.1.3:8080/cirela?source_name="+ source_name + "&target_name=" + target_name ;
//    //step2新建主机用户(在用户属性里有修改的时候)
//    
//    //step2新建主机用户(用户属性不修改，仅建立relation)
//    url = "http://192.168.1.3:8080/cirela?source_name="+ source_name + "&target_name=" + target_name ;
//    $.post(url,function(data){alert(data);})
//    //step2新建主机用户(用户属性不修改，仅建立relation)
//    
//
//    
//    //step4
//    
//}    

function new_baseline(tmp){
    var str = "<table><tr><td>"+ tmp+"<td></tr></table>";
    $("#baseline_container").append(str);

 }

function addkernel(){
    var tmpstr = "<div class=\"input-group col-md-12\"> <font style=\"font-size:20px\">"+
                 "内核参数</font> <input type=\"text\" style=\"width:100%\"></div>";
    //alert(tmpstr);
    $("#AdvancedKernel").append(tmpstr);
  }

$(function(){
    $("#chkbx_host").change(function() {
        if(!$("#chkbx_host").is(':checked')){
          $("#div_databaseline").hide();
        }
        else{
          $("#div_databaseline").show();
        }
    });  
    $("#chkbx_app").change(function() {
        if(!$("#chkbx_app").is(':checked')){
          $("#div_appbaseline").hide();
        }
        else{
          $("#div_appbaseline").show();
        }
    }); 
    $("#chkbx_trade").change(function() {
        if(!$("#chkbx_trade").is(':checked')){
          $("#div_tradebaseline").hide();
        }
        else{
          $("#div_tradebaseline").show();
        }
    });      
})

function gotostep2()
{
    $(".ystep").setStep(2);
    $('#myTabContent [href="#step2"]').tab('show');
    var oTable = $('#baselineuserlist').dataTable( {
            "bAutoWidth": false,                                        //页面自动宽度
            "processing" : true,
            "bPaginate": false,                                        //页面分页（右下角）
            "bFilter": false, //过滤功能
            "bSort": false, //排序功能
            "bInfo": false ,//页脚信息
            "ajax" : {
                "url" : "/ajax_getosuser_baseline",
                "dataSrc" : "",
                "async" : false, 
                "bDeferRender": true
                
            },
            "aoColumns": [
                 { "data": "NAME"},
                 { "data": "NAME"},
                 { "data": "DESCRIPTION" },
                 { "data": ""},
                 { "data": "FAMILY_ID"},
                 { "data": "NAME" },
            ],
            "columnDefs": [ 
                {
                "targets": 3,
                "mRender" : function(data, type, full){
                        return "<button type=\"button\" class=\"btn btn-default\" onclick=\"show_detail(this)\">" +
                               "点击查看属性</button>";
                    }
                },
                {
                "targets": 0,
                "mRender" : function(data, type, full){
                        if(data=="root"){
                            return "<input style=\"width:20px;height:20px\" disabled=true " +
                                       "checked=\"checked\" type = \"checkbox\" name=\"host_selected\"/>";
                        }else{
                             return "<input style=\"width:20px;height:20px\" type = \"checkbox\" name=\"host_selected\"/>";
                        }
                    }
                },
                {
                "targets": 4 ,
                "visible":false,
                "mRender" : function(data, type, full){
                    array_url[array_index1][array_index2] = data;
                    array_index2 = array_index2 + 1;
                    //array_url用来存储默认用户的id和name，array_index1,2用来表示array_url的下标
                    }
                },
                {
                	
                "targets": 5 ,
                "visible":false,
                "mRender" : function(data, type, full){
                     array_url[array_index1][array_index2] = data;
                     array_index1 = array_index1 + 1;
                     array_index2 = array_index2 - 1;
                    }
                }
            ],
            "oLanguage": {                                             //自定义内容——国际化
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                //"sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfo": "共 _TOTAL_ 个属性",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页" ,
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                "sZeroRecords": "没有检索到数据",
            },
    } );
}

function gotostep3()
{
    $(".ystep").setStep(3);
    $('#myTabContent [href="#step3"]').tab('show');
}

function show_detail(obj){
    var cid = $(obj).parent().prevAll().length  ;
    var rid = $(obj).parent().parent().prevAll().length;
    var ci_fid = array_url[rid][0];
    if(obj == "new"){
        
    }
    else{
    	 
    if(obj == "adduser"){
    	  $.ajaxSettings.async = false;
        $.getJSON("/ajax_get_citype_all_attr?ci_type_fid=FCIT00000007", function(data) {
        	  user_attr = data ;
            var userattrtype_html = "";
            for(var i = 0; i < data.length; i++){
                    
                    //alert(data[i]['mandatory']);
                    userattrtype_html += "<div style=\"margin-top:2%\" class=\"col-md-12\"><font class=\"col-md-6\">"+data[i]["NAME"]           +
                                     "</font><input type=\"text\" style=\"margin-left:15%\" id=\""   +
                                     data[i]["FAMILY_ID"]+"\"></div>";
              
            }
            $('#modal-userattr').html(userattrtype_html);
        });
        $("#user_modal").modal('show');	
        adduser_or_showuser = "add";
    }else{
        $.ajaxSettings.async = false;//取消ajax的异步作用，让全局变量在函数结束前，就能改变。
        $.getJSON("/ajax_get_ci_all_attr?cifid=" + ci_fid, function(data) {
            default_user_attr = data;//FAMILY_ID+VALUE+CIAT_NAME
            });
        $.getJSON("/ajax_get_citype_all_attr?ci_type_fid=FCIT00000007", function(data) {
            user_attr = data ;//NAME+FAMILY_ID
        })	 
        var userattr_html = "";
        //alert(user_attr.length);
        for(var i = 0; i < user_attr.length; i++){
        	  var k = 0 ;
            for(var j = 0 ; j < default_user_attr.length ; j++ ){
                if(user_attr[i]["FAMILY_ID"] == default_user_attr[j]["TYPE_FID"]){
                    userattr_html += "<div style=\"margin-top:2%\" class=\"col-md-12\"><font class=\"col-md-5\">"+user_attr[i]["NAME"] +
                                     "</font><input type=\"text\" style=\"margin-left:15%\" value=\""+ default_user_attr[j]["VALUE"] +"\" "+ 
                                     "id=\""+default_user_attr[j]["FAMILY_ID"]+"\"></div>";
                    k = k + 1 ;
                }
            }
            if (k == 0){
                    userattr_html += "<div style=\"margin-top:2%\" class=\"col-md-12\"><font class=\"col-md-5\">"+user_attr[i]["NAME"] +
                                     "</font><input type=\"text\" style=\"margin-left:15%\" id=\""   +
                                     user_attr[i]["FAMILY_ID"]+"\"></div>";
            }
        }
        $('#modal-userattr').html(userattr_html);
        $("#user_modal").modal('show');
        adduser_or_showuser = "show";
    }
  }
}
function adduser()
{
    //alert($("#FCAT00000027").id()); $("#modal-userattr input[type=text]")
    //var list = $("#modal-userattr input[type=text]");
    //for (var i= 0;i<list.length-2;i++){
     //   user_attr_list[list[i].id] = list[i].value;
   //} 
   //alert(list[0].id);
   // alert(user_attr_list['FCAT00000118']);
   var username = $("#FCAT00000027").val();
   new_user[username] = new Array();
   for (var i = 0 ; i < user_attr.length-1 ; i++){
   	   new_user[username][i] = new Array();
       new_user[username][i][0] = user_attr[i]["FAMILY_ID"];
       var fid = user_attr[i]["FAMILY_ID"];
       new_user[username][i][1] = $("#"+fid).val();
   }
   if(adduser_or_showuser == "add"){

       var html = "<tr><td>Add</td><td>"+ username +"</td><td>Add</td><td><button type=\"button\" " +
                  " class=\"btn btn-default\" onclick=\"show_detail('new')\" >点击查看属性</button></td></tr>";   
       $("#baselineuserlist").append(html);
   	}
}

function get_val(){
	var allattr = ""
	for(i in new_user){
		    for (j in new_user[i]){
		        allattr += "fid:="+new_user[i][j][0]+"value:="+new_user[i][j][1];
		    }
		}
		alert(allattr);
}
function gotostep4()
{
    $("#hostbaseline tr:eq(0) th:eq(0)").text($("#os").val());
    $("#databaseline tr:eq(0) th:eq(0)").text($("#os").val());
    $("#safebaseline tr:eq(0) th:eq(0)").text($("#os").val());
    $("#appbaseline tr:eq(0) th:eq(0)").text($("#os").val());
    $("#tradebaseline tr:eq(0) th:eq(0)").text($("#os").val());
    $(".ystep").setStep(4);
    $('#myTabContent [href="#step4"]').tab('show');
}

function gotostep5()
{
    $(".ystep").setStep(5);
    $('#myTabContent [href="#step5"]').tab('show');

}

function backtostep1()
{
    $(".ystep").setStep(1);
    $('#myTabContent [href="#step1"]').tab('show');

}

function backtostep3()
{
    $(".ystep").setStep(3);
    $('#myTabContent [href="#step3"]').tab('show');
}

function backtostep4()
{
    $(".ystep").setStep(4);
    $('#myTabContent [href="#step4"]').tab('show');
}    

function newip(){
    var ipaddr  = $("#ipaddr").val();
    var bonging = $("input[name='bonging']:checked").val();
    var ipname  = $("#ipname").val();
    var subnetmask  = $("#subnetmask").val();
    var netgate  = $("#netgate").val();
    var loadwhenboot ;
    if($("#loadwhenboot").is(':checked')){
        loadwhenboot = "开机加载";
    }
    else{
        loadwhenboot = "开机不加载";
    }
    var managedbynetwork ;
    if($("#managedbynetwork").is(':checked')){
        managedbynetwork = "被NetworkManager管理";
    }
    else{
        managedbynetwork = "不被NetworkManager管理";
    }
    //alert(bonging+ipaddr+ipname+subnetmask+netgate+loadwhenboot);
    var str = "<div class=\"input-group  col-md-11\"  >"                               +
              "<table class=\"table table-bordered\">"                                                +
              "<thead><tr><th class=\"col-md-5\">IP名称</th><th>"+ipname+"</th></tr></thead>"         +
              "<tbody>"                                                                               +
              "<tr><td>Ip地址</td><td>" + ipaddr +"</td></tr>"                                        +
              "<tr><td>子网掩码</td><td>" + subnetmask +"</td></tr>"                                  +
              "<tr><td>网关地址</td><td>" + netgate +"</td></tr>"                                     +
              "<tr><td>"+loadwhenboot+"</td><td>" + managedbynetwork +"</td></tr>"                    +
              "</table>"
              +"</div>  ";
    
    $("#ipalready").append(str);
    //新增一个ip
    $("input").filter(":radio").removeAttr("checked");
    //把已选中的钩去掉
    $("input").filter(":checkbox").removeAttr("checked");
    //把已选中的钩去掉
    var cleartext = $("#IpText  :text");
  
    for (var i = 0; i<cleartext.length ; i ++){
        cleartext[i].value = "";
    }
}
  
$(document).ready(function(){
    $("#ystep").loadStep({
        size: "large",
        color: "blue",
        steps: [{
            title: "主机信息",
            content: "填写主机基本信息"
        },{
            title: "用户配置",
            content: "具体账户配置"
        },{
            title: "网络配置",
            content: "各类网络信息"
        },{
            title: "基线配置",
            content: "待填充"
        },{
            title: "高级配置",
            content: "更高级配置"
        }]
    });
    
    var arr = new Array();
    arr.push("123");
    arr.push("2234");
    var i;
    for(i=0;i<arr.length;i++){
        //alert(arr[i]);    
    }
})

function submit(){
        
}