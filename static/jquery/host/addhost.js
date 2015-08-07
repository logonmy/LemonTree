 array_url= new Array();//默认加载的用户，现设定最大值为9
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

//声明post提交语句的url
var url_create_host_ci = "";
//记录step2中的勾选中的新增用户
var checkbox_new_user = new Array();
//记录step2中的勾选中的默认用户
var checkbox_default_user = new Array();

//checkbox_baseline 用来存放要提交的基线
//checkbox_baseline_index 用来做数组下表，在datatable生成的时候保存baseline 
//是ajax调出的所有baseline信息
var checkbox_baseline = new Array();
var checkbox_baseline_type = 0;
var checkbox_baseline_displayname = 0;
var baseline = new Array();

//定义datatable变量，保存step2中userlist table和step3中baseline tables。其目的是解决re-initalization操作
var vuserlist;
var vbaselinelist;

//全局变量，保存step5中是否显示添加完毕后的table
var table_status = "hidden";


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
/*
    实现wizard导航界面中，上一步、下一步按钮点击跳转功能
*/
function backtostep1()
{
    $(".ystep").setStep(1);
    $('#myTabContent [href="#step1"]').tab('show');
}

function backtostep2()
{
    $(".ystep").setStep(2);
    $('#myTabContent [href="#step2"]').tab('show');
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

function gotostep2()
{
    //将Step1中填写的信息生成对应的POST url语句
    var step1_hostname = document.getElementById("step1_host_name").value;
    var step1_osversion = $("#osversion").find("option:selected").text(); 
    var step1_description = document.getElementById("step1_description").value;
    url_create_host_ci = "/ajax_ci?ciname="+ step1_hostname +"&ci_type_fid=FCIT00000001";
    if ($.trim(step1_description) != "") 
        url_create_host_ci += "&description=" + step1_description;
    
    //url_create_host_ci = "/ajax_ci?ciname="+ step1_hostname +"&ci_type_fid=FCIT00000001&description=" + step1_description;
    
    $(".ystep").setStep(2);
    $('#myTabContent [href="#step2"]').tab('show');
                  
    if (typeof vuserlist == 'undefined') {
        vuserlist = $('#baselineuserlist').dataTable( {
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
                "targets": 0,
                "mRender" : function(data, type, full){
                        if(data=="root"){
                            return "<input disabled=true " +
                                       "checked=\"checked\" type = \"checkbox\" name=\"host_selected\"/>";
                        }else{
                             return "<input type = \"checkbox\" name=\"host_selected\"/>";
                        }
                    }
                },
                {
                "targets": 3,
                "mRender" : function(data, type, full){
                        return "<button type=\"button\" class=\"btn btn-link\" onclick=\"show_detail(this)\">" +
                               "查看属性</button>";
                    }
                },
                {
                "targets": 4 ,
                "visible":false,
                "mRender" : function(data, type, full){
                    array_url[array_index1] =  new Array();
                    array_url[array_index1][array_index2] = data;
                    array_index2 = array_index2 + 1;
                    return 0;
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
                     return 0;
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
    }else{
        //vuserlist.fnClearTable( 0 );
        vuserlist.fnDraw();
    }
}

function gotostep3()
{
    $(".ystep").setStep(3);
    $('#myTabContent [href="#step3"]').tab('show');
}

function gotostep4()
{
    //添加用户代码。注意：该段代码应该在gotostep3中，由于step3功能暂时未实现，故暂时在该函数中实现
    var length_user = $("#baselineuserlist tr").length;
    for(var i = 1 ; i < length_user ; i ++)
    {
        if($("#baselineuserlist tr:eq("+ i +") td:eq(0) ").children().is(':checked'))
       {
            var k  = 0;
            //checkbox_new_user[i-1] = $("#baselineuserlist tr:eq("+ i +") td:eq(1)").text();
            for(var j = 0 ; j < array_url.length; j++)
            {
                //array_url 用来判断是否是默认5个用户里的 j对应的是user，0对应j的familyid，1对应j的name
                if($("#baselineuserlist tr:eq("+ i +") td:eq(1)").text() == array_url[j][1])
                {
                    checkbox_default_user.push(array_url[j][0]);
                    k ++;
                }

            }
            if(k==0)
            {
                checkbox_new_user.push($("#baselineuserlist tr:eq("+ i +") td:eq(1)").text());
            }
        }
    }
    
    $(".ystep").setStep(4);
    $('#myTabContent [href="#step4"]').tab('show');
    
    if (typeof vbaselinelist == 'undefined') {
        vbaselinelist = $('#baselinelist').dataTable( {
            "bAutoWidth": false,                                        //页面自动宽度
            "processing" : true,
            "bPaginate": false,                                        //页面分页（右下角）
            "bFilter": false, //过滤功能
            "bSort": false, //排序功能
            "bInfo": false ,//页脚信息
            "ajax" : {
                "url" : "/ajax_get_baseline_list",
                "dataSrc" : "",
                "async" : false, 
                "bDeferRender": true,
            },
            "aoColumns": [
                { "data": "TYPE"},
                { "data": "DISPLAYNAME"},
                { "data": "DESCRIPTION" },
            ],
            "columnDefs": [
                {
                "targets": 0,
                "mRender" : function(data, type, full){
                      baseline[checkbox_baseline_type] = new Array();
                      baseline[checkbox_baseline_type][checkbox_baseline_displayname] = data;
                      checkbox_baseline_displayname = checkbox_baseline_displayname + 1;
                      return "<input type = \"checkbox\" name=\"host_selected\" />";
                    }
                },
                {
                "targets": 1,
                "mRender" : function(data, type, full){
                      baseline[checkbox_baseline_type][checkbox_baseline_displayname] = data;   
                      checkbox_baseline_displayname = 0;
                      checkbox_baseline_type = checkbox_baseline_type + 1;
                      return data;
                    }
                },            
                
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
    }else{
        vbaselinelist.fnDraw();
    }
    
}

function gotostep5()
{
    var j = 0;
    for(var i = 0 ; i < baseline.length+1 ; i ++)
    {
        if ($("#baselinelist tr:eq("+ i +") td:eq(0) ").children().is(':checked'))
        {
            for(var k = 0 ; k < baseline.length ;  k ++)
            {
                if(baseline[k][1]==$("#baselinelist tr:eq("+ i +") td:eq(1)").text())
                {
                    checkbox_baseline[j] = baseline[k][0];
                    j++;
                }
            }
        }
    }
//    for (var i=0;i<checkbox_baseline.length;i++)
//        alert(checkbox_baseline[i]);
    
    //alert(checkbox_baseline);
    
    $(".ystep").setStep(5);
    $('#myTabContent [href="#step5"]').tab('show');

}

/*  点击添加用户和查看属性按钮都调用该方法
    添加用户，传入参数为adduser
*/
function show_detail(obj){
    var cid = $(obj).parent().prevAll().length  ;
    var rid = $(obj).parent().parent().prevAll().length;
    var ci_fid = array_url[rid][0];
    userattr_table = "";
    if(obj == "adduser"){
        if(table_added == ""){
            $.ajaxSettings.async = false;
            var userattr_table ="";
            /*
                返回值实例：
                "MANDATORY":"Y",
                "NAME":"PROFILE_EXPORT_LD_LIBRARY_PATH",
                "FAMILY_ID":"FCAT00000117",
                "CITYPE_NAME":"OS_USER",
                "CI_TYPE_FID":"FCIT00000007",
                "CHANGE_LOG":"initialization",
                "VALUE_TYPE":null,
                "OWNER":null,
                "DISPLAYNAME":null,
                "DESCRIPTION":null
            */
            $.getJSON("/ajax_get_citype_all_attr?ci_type_fid=FCIT00000007", function(data) {
                user_attr = data ;
            })
            for(var i = 0; i < user_attr.length; i++){
                userattr_table += "<tr><td>" + user_attr[i]["NAME"] +"</td>"                    +
                              "<td><input type=\"text\" class=\"form-control\" id = \"" + user_attr[i]["FAMILY_ID"] + "\"/></td>"+
                              "<td><input type=\"text\" class=\"form-control\" id = \"description_" + user_attr[i]["FAMILY_ID"] + "\"/></td>"+
                              "<td><input type=\"text\" class=\"form-control\" id = \"owner_" + user_attr[i]["FAMILY_ID"] + "\"/></td></tr>";
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

function show_configuration_kernel() {
    var table_row = "";
    //后续可以加上不可为空项添加has-error has-feedback属性
    if ($('#kernel_name').val() == "" || $('#kernel_value').val() == ""){
        alert("内核参数名与内核参数值不可为空，请确认！");
        return
    }

    table_row = "<tr>" + 
                "<td>" + $('#kernel_name').val() + "</td>" +
                "<td>" + $('#kernel_value').val() + "</td>" +
                "<td>" + $('#kernel_des').val() + "</td>" +
                "<td><button type=\"button\" class=\"btn btn-link\" onclick=\"table_del()\">删除</button></td>" +
                "</tr>";
    $('#table_kernellist').append(table_row);
    $('#div_kernellist').show();
        

    
}

function show_configuration_crontab() {
    var table_row = "";
    var croncmd = "";
    if ($('#cron_min').val() == "" || $('#cron_hour').val() == ""
        || $('#cron_dmon').val() == "" || $('#cron_mon').val() == ""
        || $('#cron_week').val() == "" || $('#cron_user').val() == "" 
        || $('#cron_cmd').val() == "" ){
        alert("调度时间、调度用户及调度命令不可为空，请确认！");
        return;
    }
    
    croncmd = $('#cron_min').val() + " " + $('#cron_hour').val() + " " +
                $('#cron_dmon').val() + " " + $('#cron_mon').val() + " " +
                $('#cron_week').val() + " " + $('#cron_user').val() + " " +
                $('#cron_cmd').val(); 
    table_row = "<tr>" + 
                "<td>" + croncmd + "</td>" +
                "<td>" + $('#cron_des').val() + "</td>" +
                "<td><button type=\"button\" class=\"btn btn-link\" onclick=\"table_del()\">删除</button></td>" +
                "</tr>";
    $('#table_crontablist').append(table_row);
    $('#div_crontablist').show();
        

    
}

function submit_add_user(){
    //alert($("#FCAT00000027").id()); $("#modal-userattr input[type=text]")
    //var list = $("#modal-userattr input[type=text]");
    //for (var i= 0;i<list.length-2;i++){
     //   user_attr_list[list[i].id] = list[i].value;
   //} 
   //alert(list[0].id);
   // alert(user_attr_list['FCAT00000118']);
   
    var username = $("#adduser_ci_value").val();
    var user_description = $("#adduser_ci_description").val();
    var user_owner = $("#adduser_ci_owner").val();
    
    //添加user ci到new_user_ci数组中
    new_user_ci[username] = new Array();
    new_user_ci[username][0] = username;
    new_user_ci[username][1] = user_description;
    new_user_ci[username][2] = user_owner;
    
    //添加该user下的所有属性到new_user_attr数组中
    new_user_attr[username] = new Array();
    for (var attr = 0 ; attr < user_attr.length ; attr++){
        var fid = user_attr[attr]["FAMILY_ID"];
        new_user_attr[username][attr] = new Array();
        
        //0：family_id   1：value   2：description    3：owner     4：ci_attr_type
        new_user_attr[username][attr][0] = fid;
        new_user_attr[username][attr][1] = $.trim($("#"+fid).val());
        new_user_attr[username][attr][2] = $.trim($("#description_"+fid).val());
        new_user_attr[username][attr][3] = $.trim($("#owner_"+fid).val());
        new_user_attr[username][attr][4] = $.trim(user_attr[attr]["NAME"]);
    }
    var html = "<tr><td><input checked=\"checked\" type = \"checkbox\" name=\"host_selected\"/></td><td>"+ 
               username +"</td><td>"+ user_description +"</td><td><button type=\"button\" " +
               " class=\"btn btn-link\" onclick=\"show_detail_new(this)\" >查看属性</button></td></tr>";
    $("#baselineuserlist").append(html);

    //表格隐藏
    $("#add_user_div").hide();
    $("#add_user_div :input").each(function () { 
        $(this).val(""); 
    })
}

function cancel_add_user(){
    $("#add_user_div :input").each(function () {
        $(this).val(""); 
    })
    $("#add_user_div").hide();
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

//step5中，生成的配置表格中，点击删除链接弹出模态框
function table_del()
{
    $("#modal_info").modal("show");
}

//模态框中点击确定后触发的动作
function modal_sure()
{

}

function submit_add_host(){
    var allattr = "";
    var ci_fid_host = "";                           //新增主机时生成的family id
    var url_create_user_ci = "";                    //执行创建user ci的url
    var url_create_user_attr = "";                  //执行创建user attr的url
    var url_create_cirela_host_user = "";           //执行创建host与user cirelation的url
    var url_create_cirela_host_baseline = "";       //执行创建host与baseline相关的所有CI的relation的url
    
    //1. 创建host
    $.post(url_create_host_ci,function(data){
        ci_fid_host = data;
    });
    
    //1.1 创建host的attributs
    
    //2. 遍历用户数组，创建用户
    //2.1 遍历模板用户, 创建模板用户并添加与host的依赖关系
    for(var i=0;i<checkbox_default_user.length;i++) {
        var ci_fid_user = checkbox_default_user[i];
        //2.1.1 创建模板用户ci
        url_create_template_user = "/ajax_copy_ci?fid=" + ci_fid_user;
        $.post(url_create_template_user,function(data){ 
            //2.1.2 建立新增用户与host之间的依赖关系
            url_create_cirela_host_user = "/ajax_cirela?source_fid=" + ci_fid_host +
                                          "&target_fid=" + data +
                                          "&relation=COMPOSITION";
            $.post(url_create_cirela_host_user, function(data){ });
        });
    }

    //2.2 遍历新增的用户
    //for (user in new_user_ci){
    for (var i=0;i< checkbox_new_user.length;i++) {
        var user = checkbox_new_user[i];
        alert(user);
        //2.2.1 创建user ci
        var ci_fid_user = "";
        url_create_user_ci = "/ajax_ci?ciname=" + new_user_ci[user][0] + "&ci_type_fid=FCIT00000007";
        if (new_user_ci[user][1] != "")
            url_create_user_ci += "&description=" + new_user_ci[user][1];
        if (new_user_ci[user][2] != "")
            url_create_user_ci += "&owner=" + new_user_ci[user][2];
        
        $.post(url_create_user_ci, function(data){ ci_fid_user = data; })
        
        //2.2.2 创建host CI与user CI的依赖关系
        url_create_cirela_host_user = "/ajax_cirela?source_fid=" + ci_fid_host +
                                      "&target_fid=" + ci_fid_user +
                                      "&relation=REFERENCE";
        $.post(url_create_cirela_host_user, function(data){ });
        
        //2.2.3 创建user CI的属性
        for (attr in new_user_attr[user]){
            var tmp_attr_type_fid = new_user_attr[user][attr][0];
            var tmp_attr_value = new_user_attr[user][attr][1];
            var tmp_attr_description = new_user_attr[user][attr][2];
            var tmp_attr_owner = new_user_attr[user][attr][3];
            
            url_create_user_attr = "/ajax_post_attr?cifid=" + ci_fid_user;
            //判断属性是否输入，若无输入，则不添加该属性到user中
            if (tmp_attr_value != "")
                url_create_user_attr += "&ciattr_type_fid=" + tmp_attr_type_fid +
                                        "&value=" + tmp_attr_value;
            else
                continue;    

            if (tmp_attr_description != "")
                url_create_user_attr += "&description=" + tmp_attr_description;
            if (tmp_attr_owner != "")
                url_create_user_attr += "&owner=" + tmp_attr_owner;
            $.post(url_create_user_attr, function(data){})
        }
    }
    
    var j = 0;
    for(var i = 0 ; i < baseline.length+1 ; i ++)
    {
        if ($("#baselinelist tr:eq("+ i +") td:eq(0) ").children().is(':checked'))
        {
            for(var k = 0 ; k < baseline.length ;  k ++)
            {
                if(baseline[k][1]==$("#baselinelist tr:eq("+ i +") td:eq(1)").text())
                {
                    checkbox_baseline[j] = baseline[k][0];
                    j++;
                }
            }
        }
    }
    
    //3. 创建host与基线相关CI的依赖关系
    for (var i=0; i < checkbox_baseline.length;i++){
        alert(checkbox_baseline[i]);
        $.getJSON("/ajax_ci?tag=" + $.trim(checkbox_baseline[i]) , function(data) {
            for(var i =0 ; i< data.length;i++){
                //获取基线包含的所有CI的Family ID
                var target_fid = data[i]["FAMILY_ID"];
                url_create_cirela_host_baseline = "/ajax_cirela?source_fid=" + ci_fid_host +
                                 "&target_fid=" + target_fid +
                                 "&relation=REFERENCE";
                alert(url_create_cirela_host_baseline);
                $.post(url_create_cirela_host_baseline , function(data) {});
            }
        });
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
            content: "选择主机所需用户及其用户组"
        },{
            title: "网络配置",
            content: "网络地址及路由配置"
        },{
            title: "基线配置",
            content: "选择主机基线"
        },{
            title: "高级配置",
            content: "内核参数、安装包及定时任务"
        }]
    });
    
    var arr = new Array();
})