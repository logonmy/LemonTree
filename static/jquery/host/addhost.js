//checkbox_baseline 用来存放要提交的基线
//checkbox_baseline_index 用来做数组下表，在datatable生成的时候保存baseline 
//是ajax调出的所有baseline信息
var checkbox_baseline = new Array();
var checkbox_baseline_type = 0;
var checkbox_baseline_displayname = 0;
var baseline = new Array();
//-----------------------------------------------------
//定义datatable变量，保存step2中userlist table和step3中baseline tables。其目的是解决re-initalization操作
var vuserlist;
var vbaselinelist;

//全局变量，保存step5中是否显示添加完毕后的table
var table_status = "hidden";
//全局变量，保存step5中，table待删除行的行号;div_hide保存待删除的div
var table_del_row = 9999 ;
var div_hide = "";
//全局变量，保存需要调用模态框的动作 
// 0:无需调用 1：step5中添加配置时，输入框为空时提示  2：step5中删除配置时
var modal_action = 0;

var citypefid_user = "";            //全局变量，保存user ci type的fid
var alluserci = new Array();        //保存step2中，所有用户的所有属性


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
    if ($("#step1_hostname").val() == "") {
        $("#modal_content").html("主机名不可为空");
        $("#modal_info").modal("show");
        $("#div_hostname").addClass("has-error");
        return;
    }
        
    $(".ystep").setStep(2);
    $('#myTabContent [href="#step2"]').tab('show');
    
    //生成模板用户的列表
     if (typeof vuserlist == 'undefined') {
        var ciname = "";
        var cides = "";
        vuserlist = $('#table_userlist').dataTable( {
            "bAutoWidth": false,                                        //页面自动宽度
            "processing" : true,
            "bPaginate": false,                                        //页面分页（右下角）
            "bFilter": false, //过滤功能
            "bSort": false, //排序功能
            "bInfo": false ,//页脚信息
            "ajax" : {
                "url" : "/ajax_ci?tag=TEMPLATE",
                "dataSrc" : "",
                "async" : false, 
                "bDeferRender": true
            },
            "aoColumns": [
                 { "data": "NAME"},
                 { "data": "DESCRIPTION" },
                 { "data": "TYPE_FID"},
                 { "data": "FAMILY_ID"},
            ],
            "columnDefs": [
                {
                "targets": 0,
                "mRender" : function(data, type, full){
                        ciname = data;
                        return data;
                    },
                },
                {
                "targets": 1,
                "mRender" : function(data, type, full){
                        cides = data;
                        return data;
                    },
                },
                {
                "targets": 2,
                "mRender" : function(data, type, full){
                        citypefid_user = data;
                        return 0;
                    },
                "bVisible" : false,
                },
                {
                "targets": 3,
                "mRender" : function(data, type, full){
                        //将用户的配置保存到alluserci中
                        var cifid = data;
                        alluserci[ciname] = new Array();
                        alluserci[ciname]['name'] = ciname;        //保存ci的description
                        alluserci[ciname]['des'] = cides;        //保存ci的description
                        $.ajaxSettings.async = false;
                        $.getJSON("/ajax_ciattr?ci_fid="+cifid, function(attr) {
                            for (var i=0;i<attr.length;i++) {
                                ciattr_fid = attr[i]['TYPE_FID'];
                                alluserci[ciname][ciattr_fid] = new Array();

                                alluserci[ciname][ciattr_fid]['value'] = attr[i]['VALUE'];
                                alluserci[ciname][ciattr_fid]['des'] = attr[i]['DESCRIPTION'];
                            }
                        });
                        
                        tr_select = "<select class=\"form-control\"  name=\""+ ciname +"\" >" +
                                "<option selected=\"true\" value=\"default\">请选择</option>" +
                                "<option value=\"attribute\">属性</option>";
                        if (ciname != "root") 
                            tr_select += "<option value=\"delete\">删除</option>";
                        tr_select += "</select>";
                        return tr_select;
                    }
                },
                
                
            ],
            "oLanguage": {                                             //自定义内容——国际化
                "sZeroRecords": "没有检索到数据",
            },
        } );
    }else{
        //vuserlist.fnClearTable( 0 );
        vuserlist.fnDraw();
    }

    //添加配置项后，点击操作下拉菜单，实现对应的功能。在此处做select的事件绑定
    $("#table_userlist select").change(function() { 
        if ( $(this).find('option:selected').val() == "attribute" )
            btn_userdetail($(this));
        else if ($(this).children('option:selected').val() == "delete")
            select_deluser($(this));
        
        //将select复位
        $(this).get(0).options[0].selected = true;
    });
}

function gotostep3()
{
    $(".ystep").setStep(3);
    $('#myTabContent [href="#step3"]').tab('show');
}

function gotostep4()
{
    
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
                "url" : "/ajax_baselinelist?tag=all",
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
    $(".ystep").setStep(5);
    $('#myTabContent [href="#step5"]').tab('show');

}

//--------------------------------------------------step 2 - START ----------------------------------------------
//step2中，用户列表和用户属性列表清空并隐藏
function div_clean() {
    //新增用户div清空隐藏
    $("#div_userci").hide();
    $("#div_userci :input").each(function() {
        $(this).val("");
    });
    //用户属性div清空隐藏
    $("#div_userattr").hide();
    $("#div_userattr :input").each(function () {
        $(this).val("");
    });
}

/*  点击添加用户和查看属性按钮都调用该方法
    添加用户，传入参数为adduser
*/
function btn_userdetail(obj) {
    $.ajaxSettings.async = false;
    var ciname  = $(obj).attr("name");    //获取ciname，即用户名
    
    //0. 将div和table全部初始化
    $("#table_userattr tr").eq(0).nextAll().remove();
    $("#div_userci").hide();
    
    //1. 显示用户属性的div
    $("#div_userattr").show();
    $("#div_userci").show();

    //2. 将user ci的所有属性显示
    $.getJSON("/ajax_ciattrtype?ci_type_fid="+citypefid_user, function(user_ciattrtype) {
        var userattr_table = "";
        for(var i = 0; i < user_ciattrtype.length; i++){
            userattr_table = "<tr><td>" + user_ciattrtype[i]["NAME"] +"</td>"                    +
                "<td><input type=\"text\" class=\"form-control\" id = \"value_" + user_ciattrtype[i]["FAMILY_ID"] + "\"/></td>"+
                "<td><input type=\"text\" class=\"form-control\" id = \"des_" + user_ciattrtype[i]["FAMILY_ID"] + "\"/></td></tr>";
            $("#table_userattr").append(userattr_table);
        }
    });
    
    //3. 判断是新增用户还是查看模板用户，如果是模板用户则将属性填入框中
    if(ciname != "adduser"){
        //将用户名和用户描述填到input中
        $('#input_username').val($(obj).parent().parent().children().eq(0).text());
        $('#input_userdes').val(alluserci[ciname]['des']);
        //从alluserci数组中，根据cifid，遍历将值填充到input中

        for (var ciattr_fid in alluserci[ciname]) {
            if (ciattr_fid == 'des' || ciattr_fid == 'name' || 
                    typeof alluserci[ciname][ciattr_fid] == 'undefined' )
                continue;

            $('#value_'+ciattr_fid).val( alluserci[ciname][ciattr_fid]['value'] );
            $('#des_'+ciattr_fid).val( alluserci[ciname][ciattr_fid]['des'] );
        }
        //将alluserci的first key,即用户名赋值到table_userattr的name，为用户名
        $("#table_userattr").attr("name", ciname);
    }else {
        //$('#input_username').attr("disabled", true);
        $('#input_username').val("");
        $('#input_userdes').val("");
    }
}

function select_deluser(obj) {
    var arr_firstkey = $(obj).attr("name");      //通过select的name，获取新增配置项的ci fid
    //1. 将该条记录删除
    $(obj).parent().parent().remove();
    //2. 从alluserci变量中，删除以该条记录的属性
    delete alluserci[arr_firstkey];
    //3. 新增用户及属性表清空、隐藏
    div_clean();
}

function submit_adduser(){
    var arrkey_first = "";
    var exist_user = 0;     //0:用户不在userlist表中，非0：用户存在表中，保存为行号

    //如果输入用户名的input可修改，则此时为新增用户

    username = $("#input_username").val();
    if (username == "") {
        $('#modal_content').html("请输入用户名");
        modal_action = 1;
        $("#modal_info").modal("show");

        return;
    }
    
    for (var i=1;i<$('#table_userlist tr').length;i++) 
        if ($('#table_userlist tr:eq('+i+') td:eq(0)').text() == username) {
            exist_user = i;
            break;
        }
        
    if (exist_user != 0) { //用户存在于userlist表中
        arrkey_first = $("#table_userattr").attr("name");
        userdes = $("#input_userdes").val();
        $('#table_userlist tr:eq('+exist_user+')  td:eq(1)').text(userdes);
        alluserci[username]['des'] = userdes;
    } else if (exist_user == 0) { //用户不存在于userlist中
        userdes = $("#input_userdes").val();
        tr_newuser = "<tr><td>" + username + "</td>" +
                        "<td>"+ userdes +"</td>" +
                        "<td><select class=\"form-control\"  name=\""+username+"\" >" +
                                "<option selected=\"true\" value=\"default\">请选择</option>" +
                                "<option value=\"attribute\">属性</option>" +
                                "<option value=\"delete\">删除</option></select></td><tr>";
        
        $("#table_userlist").append(tr_newuser);
        
        //添加配置项后，点击操作下拉菜单，实现对应的功能。在此处做select的事件绑定,但是首先去除事件绑定
        $("#table_userlist select").unbind("change");
        $("#table_userlist select").change(function() { 
            if ( $(this).find('option:selected').val() == "attribute" )
                btn_userdetail($(this));
            else if ($(this).children('option:selected').val() == "delete")
                select_deluser($(this));
            
            //将select复位
            $(this).get(0).options[0].selected = true;
        });
        
        alluserci[username] = new Array();
        alluserci[username]['name'] = username;
        alluserci[username]['des'] = userdes;
        arrkey_first = username;
    }

    //添加user的属性到alluserci数组中
    for (var row = 1; row< $('#table_userattr tr').length;row++) {
        arrkey_sec = $('#table_userattr tr:eq('+row+') td:eq(1) input').attr("id").split('_')[1];
        ciattr_value = $('#table_userattr tr:eq('+row+') td:eq(1) input').val();
        //如果属性值为空，并且alluserci数组中没有该条记录，则继续
        if (ciattr_value == "" && typeof alluserci[arrkey_first][arrkey_sec] == 'undefined')
            continue;
        //如果属性为空，且alluserci数组中保存有该条记录（删除）
        if (ciattr_value == "" && typeof alluserci[arrkey_first][arrkey_sec] != 'undefined') {
            delete alluserci[arrkey_first][arrkey_sec];
            continue;
        }
        if ( typeof alluserci[arrkey_first][arrkey_sec] == 'undefined')
            alluserci[arrkey_first][arrkey_sec] = new Array();
        alluserci[arrkey_first][arrkey_sec]['value'] = ciattr_value;
        ciattr_des = $('#table_userattr tr:eq('+row+') td:eq(2) input').val();
        if (ciattr_des != "")
            alluserci[arrkey_first][arrkey_sec]['des'] = ciattr_des;
    }

    //表格清空并隐藏
    div_clean();

}

function cancel_adduser(){
    //将新增用户和用户属性表中的输入值全部清空、隐藏
    div_clean();
}
//--------------------------------------------------step 2 - END ----------------------------------------------


//--------------------------------------------------step 5 - START ----------------------------------------------
function btn_additem(obj)
{
    var button_name = obj.name;
    var table_row = "";
    
    if ( button_name == "btn_addkernel" ){
        
        //后续可以加上不可为空项添加has-error has-feedback属性
        //step5中添加配置时，输入框为空时提示  将modal_action置1
        if ($('#kernel_name').val() == "" || $('#kernel_value').val() == ""){
            modal_action = 1;
            $("#modal_content").html("内核参数名与内核参数值不可为空，请确认!");
            $("#modal_info").modal("show");
            return;
        }
        
        table_row = "<tr>" + 
                    "<td>" + $('#kernel_name').val() + "</td>" +
                    "<td>" + $('#kernel_value').val() + "</td>" +
                    "<td>" + $('#kernel_des').val() + "</td>" +
                    "<td><button type=\"button\" name=\"div_kernellist\" class=\"btn btn-link\" onclick=\"table_del(this)\">删除</button></td>" +
                    "</tr>";
        $('#table_kernellist').append(table_row);
        $('#div_kernellist').show();
        
    }else if ( button_name == "btn_addcron" ) {
        var croncmd = "";
        if ($('#cron_min').val() == "" || $('#cron_hour').val() == ""
            || $('#cron_dmon').val() == "" || $('#cron_mon').val() == ""
            || $('#cron_week').val() == "" || $('#cron_user').val() == "" 
            || $('#cron_cmd').val() == "" ){
            modal_action = 1;
            $("#modal_content").html("调度时间、调度用户及调度命令不可为空，请确认!");
            $("#modal_info").modal("show");
            return;
        }
        
        croncmd = $('#cron_min').val() + " " + $('#cron_hour').val() + " " +
                    $('#cron_dmon').val() + " " + $('#cron_mon').val() + " " +
                    $('#cron_week').val() + " " + $('#cron_user').val() + " " +
                    $('#cron_cmd').val();

        table_row = "<tr>" + 
                    "<td>" + croncmd + "</td>" +
                    "<td>" + $('#cron_des').val() + "</td>" +
                    "<td><button type=\"button\" name=\"div_crontablist\" class=\"btn btn-link\" onclick=\"table_del()\">删除</button></td>" +
                    "</tr>";
        $('#table_crontablist').append(table_row);
        $('#div_crontablist').show();
        
    }
}

//step5中，生成的配置表格中，点击删除链接弹出模态框
function table_del(obj)
{
    table_del_row = $(obj).parent().parent().prevAll().length;
    //获取当前table的总行数（包括标题）
    table_total_row = $(obj).parent().parent().parent().children("tr").length;
    modal_action = 3;
    $("#modal_content").html("确认删除该记录？");
    $("#modal_info").modal("show");
    if (table_del_row == 1 && table_total_row == 2)
        div_hide = obj.name;
}

//模态框中点击确定后触发的动作
function modal_sure()
{
    //step5中添加配置时，输入框为空时提示。执行操作：隐藏模态框
    //if (modal_action == 1)

    if ( modal_action == 2) {
        window.location.href="/hostlist";   //添加完毕，页面跳转置主机列表
        return;
    }else if ( modal_action == 3) {
        $("#table_kernellist tr:eq("+ table_del_row+")").remove();
    }
    
    modal_action = 0;
    if (div_hide != "")
        $("#"+div_hide+"").hide();
    $("#modal_info").modal("hide");
}

function btn_createhost()
{
    //弹出模态框，提示正在创建基线
    $('#modal_content').html("正在创建，请稍后...");
    modal_action = 2;
    $("#modal_info").modal("show");
    setTimeout("createhost()", 1000);                       //创建基线
}

function createhost(){
    var err_num = 0;                //保存创建失败的个数
    var err_content = "";           //保存创建失败的日志
    
    var cifid_host = "";                           //新增主机时生成的family id
    var cifid_user = "";                           //新增用户生成的family id
   
    var url_create_host_ci = "";                    //执行创建host的url
    var url_create_user_ci = "";                    //执行创建user ci的url
    var url_create_user_attr = "";                  //执行创建user attr的url
    var url_create_cirela_host_user = "";           //执行创建host与user cirelation的url
    var url_create_cirela_host_baseline = "";       //执行创建host与baseline相关的所有CI的relation的url
    
    $.ajaxSettings.async = false;               //设置ajax同步执行
    //1. 创建host
    //将Step1中填写的信息生成对应的POST url语句
    var step1_hostname = $("#step1_hostname").val(); 
    var step1_description = $("#step1_description").val();
    var citypefid_host = $("#step1_hostname").attr("name");
    
    url_create_host_ci = "/ajax_ci?ciname="+ step1_hostname +"&ci_type_fid=" + citypefid_host;
    if ($.trim(step1_description) != "") 
        url_create_host_ci += "&description=" + step1_description;
    $.post(url_create_host_ci,function(data){
        if(data == 2 || data == 3) {     //插入host失败
            err_num += 1;
            err_content += "<p>" +  err_num + ". 新增主机失败</p>";
            $('#modal_content').html(err_content);
            return;
        }
        cifid_host = data;
        //1.1 创建host的attributs
        var step1_osversion = $("#select_osversion").find("option:selected").text();
        url_hostattr = "/ajax_ciattr?cifid="+cifid_host+"&ciattr_type_fid="+$("#select_osversion").attr("name") + "&value=" + step1_osversion;
        $.post(url_hostattr, function(data){  
            if (data == 2 || data == 3) {
                err_num += 1;
                err_content +=  "<p>" + err_num + ". 新增主机操作系统版本失败</p>";
            }
        });
    });
    

    //2. 遍历用户数组，创建用户
    for (var firstkey in alluserci) {

        //2.1. 创建user ci
        url_create_user_ci = "/ajax_ci?ciname=" + firstkey + "&ci_type_fid=" + citypefid_user;
        
        if (typeof alluserci[firstkey]['des'] != 'undefined')
            url_create_user_ci += "&description=" + alluserci[firstkey]['des'];
        
        $.post(url_create_user_ci, function(data){
            if (data == 2 || data == 3) {
                err_num += 1;
                err_content += "<p>" +  err_num + ". 添加用户"+firstkey+"失败</p>";
            }
            cifid_user = data;
        });

        if (cifid_user == 1)
            continue;

        //2.2. 创建user attr
        for (var ciattrtypefid in alluserci[firstkey]) {
            //判断属性是否输入，若无输入，则不添加该属性到user中
            if (typeof alluserci[firstkey][ciattrtypefid]['value'] == 'undefined')
                continue;

            url_create_user_attr = "/ajax_ciattr?cifid=" + cifid_user;
            url_create_user_attr += "&ciattr_type_fid=" + ciattrtypefid +
                                    "&value=" + alluserci[firstkey][ciattrtypefid]["value"];

            if ( typeof alluserci[firstkey][ciattrtypefid]["des"] != 'undefined')
                url_create_user_attr += "&description=" + alluserci[firstkey][ciattrtypefid]["des"];
            
            $.post(url_create_user_attr, function(data){
                if (data ==2 || data ==3){
                    err_num += 1;
                    err_content += "<p>" +  err_num + ". 创建主机属性失败，"+url_create_user_attr+"</p>";
                }
            });
        }

        
        //2.3. 创建host与user 的关系
        url_create_cirela_host_user = "/ajax_cirela?source_fid=" + cifid_host +
                                      "&target_fid=" + cifid_user +
                                      "&relation=COMPOSITION";
        $.post(url_create_cirela_host_user, function(data){ 
            if (data == 2 || data == 3 ) {
                err_num += 1;
                err_content += "<p>" +  err_num + ". 创建主机与用户关系失败，"+url_create_cirela_host_user+"</p>";
            }
        });
    }

    //3. 创建host与基线相关CI的依赖关系
    //将
    var j = 0;
    for(var i = 0 ; i < baseline.length+1 ; i ++)
        if ($("#baselinelist tr:eq("+ i +") td:eq(0) ").children().is(':checked'))
            for(var k = 0 ; k < baseline.length ;  k ++)
                if(baseline[k][1]==$("#baselinelist tr:eq("+ i +") td:eq(1)").text())
                    checkbox_baseline[j++] = baseline[k][0];

    for (var i=0; i < checkbox_baseline.length;i++){
        $.getJSON("/ajax_ci?tag=BASELINE:" + $.trim(checkbox_baseline[i]) , function(data) {
            for(var i =0 ; i< data.length;i++){
                //获取基线包含的所有CI的Family ID
                var target_fid = data[i]["FAMILY_ID"];
                url_create_cirela_host_baseline = "/ajax_cirela?source_fid=" + cifid_host +
                                 "&target_fid=" + target_fid +
                                 "&relation=REFERENCE";
                
                $.post(url_create_cirela_host_baseline , function(data) {
                    if (data == 2 || data == 3 ) {
                        err_num += 1;
                        err_content += "<p>" +  err_num + ". 创建主机与基线配置项关系失败，"+url_create_cirela_host_baseline+"</p>";
                    }
                });
            }
        });
    }
    
    //4. 创建step5中，主机高级配置：内核参数
    
/*    if ($('#table_kernellist tr').length != 1)
        //4.1 创建host专属的内核参数CI。因为内核参数包含在基线中的
        $.post("/ajax_ci?ciname="+$('#step1_host_name').val()+"_kernel" + 
                "&ci_type_fid=FCIT00000008" +
                "&description=" + $('#step1_host_name').val() + "的内核参数配置" + 
                "&priority=10", function(data){ ci_fid_kernel = data; });
        //4.2 遍历表中的参数，将参数添加到新增的内核参数CI
        for (var row=1; row < $('#table_kernellist tr').length; row++){
            for (var col = 0;col < $('#table_kernellist tr:eq(0) td').length;col++){
                
            }
    }*/
    
    //5. 创建step5中，主机高级配置：定时任务
/*    if ($('#table_kernellist tr').length != 1)
        //4.1 创建host专属的内核参数CI。因为内核参数包含在基线中的
        
        //4.2 遍历表中的参数，将参数添加到新增的内核参数CI
        for (var row=1; row < $('#table_kernellist tr').length; row++){
            for (var col = 0;col < $('#table_kernellist tr:eq(0) td').length;col++){
                
            }
    }*/
    if (err_num != 0)
        $('#modal_content').html(err_content);
    else
        $('#modal_content').html("成功创建主机！");
}
  
