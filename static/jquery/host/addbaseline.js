// 0:无需调用 1：step2中添加配置时，输入框为空时提示  2：输入changelog
var modal_action = 0;

//全局变量：保存所有新增配置项ci type fid
var allci = new Array();

$(document).ready( function(){
    $("#ystep").loadStep({
        size: "large",
        color: "blue",
        steps: [{
            title: "基线信息",
            content: "填写基线基本信息"
        },{
            title: "基线配置",
            content: "填写基线配置项及配置项属性"
        }]
    });
    
});

//实现wizard导航界面中，上一步、下一步按钮点击跳转功能
function backtostep1()
{
    $(".ystep").setStep(1);
    $('#myTabContent [href="#step1"]').tab('show');
}

function gotostep2()
{
    if ( $('#input_baseline_name').val() == "" || $('#input_baseline_type').val() == "") {
        $("#modal_content").html("基线名称与基线类别不可为空，请确认!");
        $("#modal_info").modal("show");
        modal_action = 1;
        return;
    }
    
    $(".ystep").setStep(2);
    $('#myTabContent [href="#step2"]').tab('show');
}

function btn_addci()
{
    var table_item = "";
    
    //如果配置项名称与配置项类型为空，则弹出模态框，取消添加配置项
    if ($("#input_citype").find("option:selected").text() == "" || $('#input_ciname').val() == "" )
    {
        $("#modal_content").html("配置项名称与配置项类型不可为空，请确认!");
        $("#modal_info").modal("show");
        modal_action = 1;
        return;
    }
    //取消表中操作下拉菜单的点击事件绑定
     $("#table_citype select").unbind("change");
    
    var citype_fid = $("#input_citype").val();        //获取配置项类型的value，即ci tpye fid
    //该变量非常重要，是citype fid与ciname拼接而成，是该页面中allci数组中，第一维的唯一标识符
    var unique_ci = citype_fid + "_" + $('#input_ciname').val()
    table_item = "<tr>" +
                 "<td>" + $('#input_ciname').val() +"</td>" + 
                 "<td>" + $("#input_citype").find("option:selected").text() +"</td>" + 
                 "<td>" + $('#input_cides').val() +"</td>" + 
                 "<td><select class=\"form-control\" id=\"select_op_"+ citype_fid +"\" name=\""+unique_ci+"\">" + 
                      "<option selected=\"true\" value=\"default\">请选择</option>" +
                      "<option value=\"attribute\">属性</option>" +
                      "<option value=\"delete\">删除</option>"+
                 "</select></td></tr>";

    $("#table_citype").append(table_item);
    $("#div_addci").show();
    
    //添加配置项后，点击操作下拉菜单，实现对应的功能。在此处做select的事件绑定
    $("#table_citype select").change(function() { 
        if ( $(this).find('option:selected').val() == "attribute" )
            select_attribute($(this));
        else if ($(this).children('option:selected').val() == "delete")
            select_delete($(this));
            
        //将select复位
        $(this).get(0).options[0].selected = true;
    });

}

/* 下拉框选择属性：显示该ci type的属性*/
function select_attribute(obj)
{
    var unique_ci = $(obj).attr("name");      //通过select的name，获取新增配置项的ci type fid

    //1. 先将table_ciattr 表动态添加的行全部删除
    $("#table_ciattr tr").eq(0).nextAll().remove();
    //2. 显示ci attr表
    $("#div_addciattr").show();
    //3. 点击添加属性后，显示该CI TYPE下的所有属性

    $.getJSON("/ajax_ciattrtype?ci_type_fid="+unique_ci.split('_')[0], function(data) {
        var ciattrtype_fid = "";
        for(var i = 0; i < data.length; i++){
            var ciattrtype_fid = data[i]["FAMILY_ID"];
            var ciattrname = data[i]["NAME"];
            //在第一个td中保存attr type的fid
            //显示全为空的输入框
            tr_ciattr = "<tr><td><input id=\"hiddeninput\" type=\"hidden\" value=\""+ ciattrtype_fid +"\">" + ciattrname +"</td>"                    +
                "<td><input type=\"text\" class=\"form-control\" id = \"value_" + ciattrtype_fid + "\"/></td>"+
                "<td><input type=\"text\" class=\"form-control\" id = \"description_" + ciattrtype_fid + "\"/></td>"+
                "</tr>";
            $("#table_ciattr").append(tr_ciattr);
            //如果allci[unique_ci][ciattrtype_fid]保存了属性值，那么将之前保存的属性填充到输入框中
            if (typeof allci[unique_ci] != 'undefined' &&
                typeof allci[unique_ci][ciattrtype_fid] != 'undefined') {
                $('#value_' + ciattrtype_fid).val( allci[unique_ci][ciattrtype_fid]["value"] );
                $('#description_' + ciattrtype_fid).val( allci[unique_ci][ciattrtype_fid]["des"] );
            }
        }
    });
    
    //4. 将ci tpye familyid赋值为table
    $("#table_ciattr").val(unique_ci);

}

//删除该配置项
function select_delete(obj)
{
    //1. 将该条记录删除
    var unique_ci = $(obj).attr("name");      //通过select的name，获取新增配置项的ci type fid
    var table_row_nums = $(obj).parent().parent().parent().children("tr").length;   //获取配置项列表的行数

    $(obj).parent().parent().remove();
    //如果表的行数为2（包含标题），那么删除记录后将隐藏div_addci
    if (table_row_nums == 2) {
        $('#div_addci').hide();             //配置项div隐藏
        $('#div_addciattr').hide();         //配置项属性div隐藏
     }
    
    //2. 从allci变量中，删除以该条记录的属性
    delete allci[unique_ci];
}

//配置项详细信息：点击保存按钮，将表格中内容保存到allci中
function submit_addciattr()
{
    var unique_ci = $("#table_ciattr").val();
    //创建出该条citype记录
    allci[unique_ci] = new Array();

    for (var row=1; row<$("#table_ciattr tr").length; row++)
    {
        //获取每行中ci attr type 的family id
        var ciattrtype_fid = $('#table_ciattr tr:eq('+row+') td:eq(0) input').val();
        allci[unique_ci][ciattrtype_fid] = new Array();
        
        //将每行的值保存在arr_ciattr数组中
        var arr_ciattr = new Array();
        allci[unique_ci][ciattrtype_fid]["value"] = $('#value_' + ciattrtype_fid).val();
        allci[unique_ci][ciattrtype_fid]["des"] = $('#description_' + ciattrtype_fid).val();
    }
    
    $('#div_addciattr').hide();
}

//配置项详细信息：点击取消按钮，将表格中内容保存到allci中
function cancel_addciattr()
{
    //var unique_ci = $("#table_ciattr").val();
    //清空该表中输入项内容
    $('#table_addciattr input').val("");
    //隐藏ci attr表
    $('#div_addciattr').hide();
}


//模态框中点击确定后触发的动作
function modal_sure()
{
    //step2中添加配置时，输入框为空时提示。执行操作：隐藏模态框
    //if (modal_action == 1)
    
    //确认添加基线
    if ( modal_action == 2) {
        window.location.href="/baselinelist";   //添加完毕，页面跳转置基线列表
        return;
    }
    
    //模态框状态为置0
    modal_action = 0;
    $("#modal_info").modal("hide");
}

function btn_createbaseline()
{
    //弹出模态框，提示正在创建基线
    $('#modal_content').html("正在创建，请稍后...");
    modal_action = 2;
    $("#modal_info").modal("show");
    setTimeout("createbaseline()", 1000);                       //创建基线
}

function createbaseline() {
    var err_num = 0;                //保存创建失败的个数
    var err_content = "";           //保存创建失败的日志
    //1. 在host模式下，将基线信息插入表中
    var baseline_name = $('#input_baseline_name').val();
    var baseline_tag = $('#input_baseline_type').val();
    var baseline_des = $('#input_baseline_description').val();
    var url_baselinelist = "/ajax_baselinelist?type=" + baseline_tag + "&displayname=" + baseline_name + "&description=" + baseline_des;
    
    $.ajaxSettings.async = false;               //设置ajax同步执行
    $.ajax({
            type: "POST",
            url: url_baselinelist,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (msg) {
                err_num += 1;
                err_content +=  err_num + ". 新增基线到基线列表失败：" + msg + "\n";
                return;
            },
    });
    
    //2. 将该基线包含的配置项保存到CMDB中
    //2.1 遍历配置项表，创建CI
    for (var row=1; row<$('#table_citype tr').length; row++) {
        
        var url_ci = "/ajax_ci?";
        var ciname = $('#table_citype tr:eq('+row+') td:eq(0)').text();
        var cides = $('#table_citype tr:eq('+row+') td:eq(2)').text();
        var unique_ci = $('#table_citype tr:eq('+row+') td:eq(3) select').attr('name');
        var citype_fid = unique_ci.split('_')[0];
        
        var cifid = "";         //保存新增ci后返回的family id
        //生成插入ci的url
        url_ci += "ciname="+ciname+"&ci_type_fid="+citype_fid+"&tag=BASELINE:"+baseline_tag;
        if ($.trim(cides) != "")
            url_ci += "&description=" + cides;
        //创建ci
        $.post(url_ci , function(data){ 
            cifid = data; 
            if (cifid == 2 || cifid == 3) { //2或者3时webapi返回的出错代码
                err_num += 1;
                err_content +=  err_num + ". 新增配置项失败，错误号:"+cifid+", 失败语句：" + url_ci + "\n";
                return;
            }

            //2.2 遍历allci数组，创建对应配置项的属性
            for (var key in allci[unique_ci] ) {
                var ciattrtype_fid = key;
                var ciattrtype_value = allci[unique_ci][key]["value"];
                var ciattrtype_des = allci[unique_ci][key]["des"];
                //如果属性的value为空，则不添加
                if ($.trim(ciattrtype_value) == "")
                    continue;
                
                //生成插入ci attr的url语句
                var url_ciattr = "/ajax_ciattr?cifid=" + cifid + "&ciattr_type_fid=" + ciattrtype_fid + 
                                "&value=" + ciattrtype_value;
                if ($.trim(ciattrtype_des) != "")
                    url_ciattr += "&description=" + ciattrtype_des;
                //创建ci attr
                $.post(url_ciattr , function(data){ 
                    if (data == 2 || data == 3) {
                        err_num += 1;
                        err_content +=  err_num + ". 新增配置项属性失败，错误号:"+data+
                            ", 失败语句：" + url_ciattr + "\n";
                    }
                });
            }
        });
        
    }
    
    if (err_num != 0)
        $('#modal_content').html(err_content);
    else
        $('#modal_content').html("成功创建基线！");
}