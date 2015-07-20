var array_url= [[],[],[],[],[],[],[],[],[]];//默认加载的用户，现设定最大值为9
var array_index1 = 0;
var array_index2 = 0;
//array_url用来存储默认用户的id和name，array_index1,2用来表示array_url的下标
var user_attr_list = new Object(); //没用到
var default_user_attr = new Array();//保存默认5个用户的现有属性
var user_attr = new Array();//保存用户所有属性
var adduser_or_showuser = "";//来判断按钮是新增还是展示
var new_user_attr = new Object();//保存新增用户的属性
var new_user_ci = new Object();
var table_added ="";

var commit_os = new Array();
var commit_user = new Array();
var commit_user_attr = new Array()();
var commit_baseline = new Array();


function creat_host_ci(obj){
    //step1新建主机ci   
    var step1_hostname = document.getElementById("step1_host_name").value;
    var step1_description = document.getElementById("step1_description").value;
    var url = "/ajax_post_ci?ciname="+ step1_hostname +"&ci_type_fid=FCIT00000001&description=" + step1_description;
    alert(url);
}

function cancel_add_user(){
	  
   	$("#add_user_div :input").each(function () { 
        $(this).val(""); 
    })
    $("#add_user_div").hide();
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
                "url" : "/ajax_get_baseline_osuser",
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
    userattr_table = "";
    if(obj == "adduser"){
        if(table_added == ""){
            $.ajaxSettings.async = false;
            var userattr_table ="";
            $.getJSON("/ajax_get_citype_all_attr?ci_type_fid=FCIT00000007", function(data) {
            user_attr = data ;
            })
            for(var i = 0; i < user_attr.length; i++){
            userattr_table += "<tr><td>" + user_attr[i]["NAME"] +"</td>"                    +
                               "<td><input type=\"text\" class=\"form-control\" id = \"" + user_attr[i]["FAMILY_ID"] + "\"/></td>"+
                              "<td><input type=\"text\" class=\"form-control\" id = \"description_" + user_attr[i]["FAMILY_ID"] + "\"/></td>"+
                              "<td><input type=\"text\" class=\"form-control\" id = \"owner_" + user_attr[i]["FAMILY_ID"] + "\"/></td>";
            }
            $("#add_user_table").append(userattr_table);
            table_added = "y";
        }
            $("#add_user_div").show();
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

function adduser()
{
    //alert($("#FCAT00000027").id()); $("#modal-userattr input[type=text]")
    //var list = $("#modal-userattr input[type=text]");
    //for (var i= 0;i<list.length-2;i++){
     //   user_attr_list[list[i].id] = list[i].value;
   //} 
   //alert(list[0].id);
   // alert(user_attr_list['FCAT00000118']);
   
    var username = $("#user_name").val();
    var userdescription = $("#user_description").val();  
    new_user_ci[username] = new Array();
    new_user_ci[username][0] =  userdescription;
    new_user_attr[username] = new Array();
    for (var i = 0 ; i < user_attr.length-1 ; i++){
        new_user_attr[username][i] = new Array();
        new_user_attr[username][i][0] = user_attr[i]["FAMILY_ID"];
        var fid = user_attr[i]["FAMILY_ID"];
        new_user_attr[username][i][1] = $("#"+fid).val();
        new_user_attr[username][i][2] = $("#description_"+fid).val();
        new_user_attr[username][i][2] = $("#owner_"+fid).val();
        new_user_attr[username][i][4] = user_attr[i]["NAME"];
    }
    var html = "<tr><td>Add</td><td>"+ username +"</td><td>"+ userdescription +"</td><td><button type=\"button\" " +
               " class=\"btn btn-default\" onclick=\"show_detail_new(this)\" >点击查看属性</button></td></tr>";   
    $("#baselineuserlist").append(html);

   	//表格隐藏
   	$("#add_user_div").hide();
   	$("#add_user_div :input").each(function () { 
        $(this).val(""); 
    })
   	
}
function show_detail_new(obj){
    var userattr_html = "";
    var col = $(obj).parent().parent().prevAll().length + 1;
    var selector = "#baselineuserlist tr:eq(" + col +") td:eq(1)";
    for (var i = 0 ; i < new_user_attr[$(selector).text()].length ; i++ ){
        userattr_html += "<div style=\"margin-top:2%\" class=\"col-md-12\"><font class=\"col-md-5\">"+
   	                     new_user_attr[$(selector).text()][i][4] +
                         "</font><input type=\"text\" style=\"margin-left:15%\" value=\""            + 
                         new_user_attr[$(selector).text()][i][1] +"\"></div>"; 
                        
    }
    $('#modal-userattr').html(userattr_html);
    $("#user_modal").modal('show');
    //adduser_or_showuser = "show";
    //alert(new_user_attr[$(selector).text()][0][3]);
}
function get_val(){
    var allattr = "";
    for (user in new_user_ci) {
        alert(user);
    }
    for(user in new_user_attr){
        for (attr in new_user_attr[user]){
            //$.post(url,function(data){alert(data);})
            allattr += "fid:="+new_user_attr[user][attr][0]+"&value:="+
                       new_user_attr[user][attr][1] + new_user_attr[user][attr][2];
        }
    }
   // alert(allattr);
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